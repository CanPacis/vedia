package memory

type StackAtom int32
type StackSlice []Stack

func (s *StackSlice) FindStack(name string) (bool, *Stack) {
	var result *Stack

	for _, slice := range *s {
		if slice.Name == name {
			result = &slice
			break
		}
	}

	if result != nil {
		return true, result
	}

	return false, &Stack{}
}

type Stack struct {
	Name   string
	Values *[]StackAtom
	At     StackChannel
}

type StackChannel int8
