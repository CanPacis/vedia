package engine

import (
	"fmt"
	"strconv"
	"vedia/src/ast"
	"vedia/src/memory"
	"vedia/src/procedure"
	"vedia/src/util"
	"vedia/src/vedia"
)

type CallstackItem struct {
	Name     string
	Body     ast.Body
	Position ast.Position
}

type Engine struct {
	Callstack  []CallstackItem
	Memory     *memory.StackSlice
	Procedures procedure.Stack
	Namespaces vedia.Namespaces
	Notifiers  map[memory.StackChannel]func([]memory.StackAtom) bool
}

func New() Engine {
	engine := Engine{}
	engine.Callstack = []CallstackItem{}
	engine.Memory = &memory.StackSlice{memory.Stack{
		Name:   "$$",
		Values: &[]memory.StackAtom{},
		At:     0,
	}}
	engine.Procedures = vedia.Lib()
	engine.Namespaces = map[string]vedia.Namespace{
		"system": {
			"memory": memory.StackChannel(8),
			"stdio":  memory.StackChannel(16),
			"fileio": memory.StackChannel(32),
		},
	}
	engine.Notifiers = map[memory.StackChannel]func(values []memory.StackAtom) bool{
		0:  vedia.NoopNotifier,
		8:  vedia.MemoryNotifier,
		16: vedia.StdIoNotifier,
		32: vedia.FileIoNotifier,
	}

	return engine
}

func (e *Engine) RunBody(name string, body ast.Body, position ast.Position) (memory.StackAtom, util.StatementError) {
	e.Callstack = append(e.Callstack, CallstackItem{Name: name, Body: body, Position: position})
	var value memory.StackAtom = -1

	for _, statement := range body {
		switch ast.GetOperation(statement) {
		case "create-statement":
			createStatement := ast.CreateStatement{}
			ast.Cast(statement, &createStatement)
			err := e.RunCreateStatement(createStatement)

			if err.Error != nil {
				return value, err
			}
		case "value-push":
			valuePush := ast.ValuePush{}
			ast.Cast(statement, &valuePush)
			err := e.RunValuePush(valuePush)

			if err.Error != nil {
				return value, err
			}
		case "procedure-definition":
			procedureDefinition := ast.ProcedureDefinition{}
			ast.Cast(statement, &procedureDefinition)
			err := e.RunProcedureDefinition(procedureDefinition)

			if err.Error != nil {
				return value, err
			}
		case "procedure-call":
			procedureCall := ast.ProcedureCall{}
			ast.Cast(statement, &procedureCall)
			var err util.StatementError
			value, err = e.RunProcedureCall(procedureCall)

			if err.Error != nil {
				return value, err
			}
		case "for-loop":
			forLoop := ast.ForLoop{}
			ast.Cast(statement, &forLoop)
			err := e.RunForLoop(forLoop)

			if err.Error != nil {
				return value, err
			}
		case "stack-move":
			stackMove := ast.StackMove{}
			ast.Cast(statement, &stackMove)
			err := e.RunStackMove(stackMove)

			if err.Error != nil {
				return value, err
			}
		}
	}

	_, e.Callstack = e.Callstack[len(e.Callstack)-1], e.Callstack[:len(e.Callstack)-1]

	return value, util.NoError()
}

func (e *Engine) RunCreateStatement(statement ast.CreateStatement) util.StatementError {
	name := statement.Name.Value.Get

	found, _ := e.Memory.FindStack(name)

	if found {
		return util.Error(fmt.Errorf("stack named %s already exists", name), statement.Name.Position)
	}

	header := statement.Header.Value.Get
	atValue, err := e.ResolveMemberExpression(statement.At)

	if err.Error != nil {
		return err
	}

	values := util.ToIntSlice(header)
	e.Notifiers[memory.StackChannel(atValue)](values)
	*e.Memory = append(*e.Memory, memory.Stack{Name: name, Values: &values, At: memory.StackChannel(atValue)})
	return util.NoError()
}

func (e *Engine) RunValuePush(statement ast.ValuePush) util.StatementError {
	target := statement.Target.Value.Get

	found, s := e.Memory.FindStack(target)

	if !found {
		return util.Error(fmt.Errorf("cannot find stack %s", target), statement.Target.Position)
	}

	values, err := e.GetIndeterminateValue(statement.Value)

	if err != nil {
		return util.Error(err, statement.Target.Position)
	}

	shouldUpdate := e.Notifiers[s.At](values)

	if shouldUpdate {
		*s.Values = append(*s.Values, values...)
	}

	return util.NoError()
}

func (e *Engine) RunProcedureDefinition(statement ast.ProcedureDefinition) util.StatementError {
	procedureName := statement.Name.Value.Get

	if e.Procedures[procedureName] != nil {
		return util.Error(fmt.Errorf("procedure named %s already exists", procedureName), statement.Name.Position)
	}

	e.Procedures[procedureName] = procedure.CustomProcedure{
		Body: statement.Body,
	}

	return util.NoError()
}

func (e *Engine) RunForLoop(statement ast.ForLoop) util.StatementError {
	procedureName := statement.Procedure.Value.Get
	iterationCount, err := e.GetIndeterminateValue(statement.Iteration)

	if err != nil {
		return util.Error(err, statement.Procedure.Position)
	}

	if e.Procedures[procedureName] == nil {
		return util.Error(fmt.Errorf("cannot find procedure %s", procedureName), statement.Procedure.Position)
	}

	call := util.ArbitraryProcedureCall(statement.Procedure)

	for i := 0; i < int(iterationCount[0]); i++ {
		_, err := e.RunProcedureCall(call)

		if err.Error != nil {
			return err
		}
	}

	return util.NoError()
}

func (e *Engine) RunStackMove(statement ast.StackMove) util.StatementError {
	// fmt.Println("moves stack", statement)
	return util.NoError()
}

func (e *Engine) RunProcedureCall(statement ast.ProcedureCall) (memory.StackAtom, util.StatementError) {
	procedureName := statement.Name.Value.Get
	target := statement.Target.Get

	p := e.Procedures[procedureName]

	if p == nil {
		return -1, util.Error(fmt.Errorf("cannot find procedure %s", procedureName), statement.Name.Position)
	}

	if p.Type() == "builtin" {
		found, s := e.Memory.FindStack(target)

		if !found {
			return -1, util.Error(fmt.Errorf("cannot find stack %s", target), statement.Name.Position)
		}

		return p.(procedure.BuiltinProcedure).Call(s)
	} else {
		return e.RunBody(procedureName, p.(procedure.CustomProcedure).Body, statement.Name.Position)
	}
}

func (e *Engine) ResolveMemberExpression(expression ast.MemberExpression) (memory.StackAtom, util.StatementError) {
	left := expression.Left.Value.Get
	right := expression.Right.Value.Get

	if e.Namespaces[left] == nil {
		return -1, util.Error(fmt.Errorf("cannot find namespace %s", left), expression.Left.Position)
	}

	return memory.StackAtom(e.Namespaces[left][right]), util.NoError()
}

func (e *Engine) GetIndeterminateValue(value interface{}) ([]memory.StackAtom, error) {
	valueType := util.GetIndeterminateValueType(value)
	var resultIntermediate int
	var result memory.StackAtom
	var err error

	if valueType == "procedure-call" {
		procedureCall := ast.ProcedureCall{}
		err = ast.Cast(value, &procedureCall)

		if err != nil {
			return []memory.StackAtom{0}, err
		}

		var statementError util.StatementError
		result, statementError = e.RunProcedureCall(procedureCall)
		err = statementError.Error
	} else {
		identifier := ast.Identifier{}
		err = ast.Cast(value, &identifier)

		if err != nil {
			return []memory.StackAtom{0}, err
		}

		if identifier.Type == "string_literal" {
			results := util.ToIntSlice(identifier.Value.Get)
			return results, nil
		} else if identifier.Type == "number_literal" {
			resultIntermediate, err = strconv.Atoi(identifier.Value.Get)
			result = memory.StackAtom(resultIntermediate)
		} else {
			result = memory.StackAtom(-1)
			err = fmt.Errorf("unknown identifier type %s", identifier.Type)
		}
	}

	return []memory.StackAtom{result}, err
}
