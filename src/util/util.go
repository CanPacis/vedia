package util

import (
	"strings"
	"vedia/src/ast"
	"vedia/src/memory"
)

func ToIntSlice(value string) []memory.StackAtom {
	result := []memory.StackAtom{}

	for _, runeValue := range value {
		result = append(result, memory.StackAtom(runeValue))
	}

	return result
}

func ToString(value []memory.StackAtom) string {
	result := []string{}

	for _, runeValue := range value {
		result = append(result, string(runeValue))
	}

	return strings.Join(result, "")
}

func GetIndeterminateValueType(value interface{}) string {
	operation := value.(map[string]interface{})["operation"]

	if operation != nil {
		return operation.(string)
	}

	_value := value.(map[string]interface{})["type"]

	if _value != nil {
		return _value.(string)
	}

	return ""
}

func ArbitraryProcedureCall(name ast.Identifier) ast.ProcedureCall {
	return ast.ProcedureCall{
		Name: name,
		Target: ast.Identifier{
			Value: ast.Value{
				Type: "identifier",
				Get:  "__main_process__",
			},
			Position: ast.Position{
				Line: 0,
				Col:  0,
			},
		},
		Exhaustive: false,
	}
}

type StatementError struct {
	ast.Position
	Error error
}

func NoError() StatementError {
	return StatementError{
		Position: ast.Position{
			Col:  0,
			Line: 0,
		},
		Error: nil,
	}
}

func Error(err error, position ast.Position) StatementError {
	return StatementError{
		Position: position,
		Error:    err,
	}
}
