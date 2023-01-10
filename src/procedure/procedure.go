package procedure

import (
	"vedia/src/ast"
	"vedia/src/memory"
	"vedia/src/util"
)

type Stack map[string]interface {
	Type() string
}

type BuiltinProcedure struct {
	Call func(s *memory.Stack) (memory.StackAtom, util.StatementError)
}

func (p BuiltinProcedure) Type() string {
	return "builtin"
}

type CustomProcedure struct {
	Body ast.Body
}

func (p CustomProcedure) Type() string {
	return "custom"
}
