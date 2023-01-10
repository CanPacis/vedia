package main

import (
	"fmt"
	"os"
	"vedia/src/ast"
	"vedia/src/engine"
	"vedia/src/parser"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("no input file was provided")
		os.Exit(1)
	}

	parsed, err := parser.ParseFile(os.Args[1])

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	engine := engine.New()
	_, fault := engine.RunBody("main", parsed.Result.Body, ast.Position{Line: 1, Col: 1})

	if fault.Error != nil {
		fmt.Printf("%s at %d:%d\n", fault.Error, fault.Line, fault.Col)
		PrintCallstack(engine)
		os.Exit(1)
	}
}

func PrintCallstack(e engine.Engine) {
	fmt.Println("\ncallstack:")
	for i, j := 0, len(e.Callstack)-1; i < j; i, j = i+1, j-1 {
		e.Callstack[i], e.Callstack[j] = e.Callstack[j], e.Callstack[i]
	}
	for _, stack := range e.Callstack {
		fmt.Printf("\t[%s] at %d:%d\n", stack.Name, stack.Position.Line, stack.Position.Col)
	}
}
