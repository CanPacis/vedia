package parser

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"vedia/src/ast"
)

func ParseString(input string) (ast.ParserResult, error) {
	cmd := exec.Command("./src/parser/parser", input)
	raw, err := cmd.Output()
	result := ast.ParserResult{}

	if err != nil {
		return result, err
	}

	err = json.Unmarshal(raw, &result)

	if err != nil {
		return result, err
	}

	if len(result.Error.Token.Value) > 1 {
		err = fmt.Errorf("unexpected token: '%s' at line %d column %d", result.Error.Token.Value, result.Error.Token.Line, result.Error.Token.Col)
		return result, err
	}

	return result, nil
}

func ParseFile(path string) (ast.ParserResult, error) {
	rawFile, err := os.ReadFile(path)
	if err != nil {
		return ast.ParserResult{}, err
	}

	return ParseString(string(rawFile))
}
