package vedia

import (
	"fmt"
	"os"
	"vedia/src/memory"
	"vedia/src/procedure"
	"vedia/src/util"
)

func Lib() procedure.Stack {

	var lib = procedure.Stack{}

	lib["len"] = procedure.BuiltinProcedure{
		Call: func(s *memory.Stack) (memory.StackAtom, util.StatementError) {
			return memory.StackAtom(len(*s.Values)), util.NoError()
		},
	}

	lib["empty"] = procedure.BuiltinProcedure{
		Call: func(s *memory.Stack) (memory.StackAtom, util.StatementError) {
			*s.Values = []memory.StackAtom{}

			return memory.StackAtom(-1), util.NoError()
		},
	}

	lib["add"] = procedure.BuiltinProcedure{
		Call: func(s *memory.Stack) (memory.StackAtom, util.StatementError) {
			return memory.StackAtom(-1), util.NoError()
		},
	}

	return lib
}

type Namespace map[string]memory.StackChannel
type Namespaces map[string]Namespace

func NoopNotifier(value []memory.StackAtom) bool {
	fmt.Println("warning! you are operating on an unknown stack channel, your operations will be blocked")

	return false
}

func MemoryNotifier(value []memory.StackAtom) bool {
	return true
}

func StdIoNotifier(value []memory.StackAtom) bool {
	os.Stdout.WriteString(util.ToString(value))
	return true
}

func FileIoNotifier(value []memory.StackAtom) bool {
	return true
}

var Standard = map[string]Namespace{
	"system": {
		"memory": memory.StackChannel(8),
		"stdio":  memory.StackChannel(16),
		"fileio": memory.StackChannel(32),
	},
}
