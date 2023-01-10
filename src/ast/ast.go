package ast

import "encoding/json"

type ParserResult struct {
	Message string      `json:"message"`
	Error   ParserError `json:"error"`
	Result  Program     `json:"result"`
}

type ParserError struct {
	Offset int   `json:"offset"`
	Token  Token `json:"token"`
}

type Position struct {
	Line int `json:"line"`
	Col  int `json:"col"`
}

type Statement struct {
	Operation string `json:"operation"`
}

type Token struct {
	Position
	Type       string `json:"type"`
	Value      string `json:"value"`
	Text       string `json:"text"`
	Offset     int    `json:"offset"`
	LineBreaks int    `json:"lineBreaks"`
}

type Program struct {
	Uses []UseStatement `json:"uses"`
	Body Body           `json:"body"`
}

type Body []interface{}

type UseStatement struct {
	Statement
	Value Identifier `json:"value"`
}

type CreateStatement struct {
	Statement
	Name   Identifier       `json:"name"`
	At     MemberExpression `json:"at"`
	Header StringLiteral    `json:"header"`
}

type ProcedureCall struct {
	Statement
	Name       Identifier `json:"name"`
	Target     Identifier `json:"target"`
	Exhaustive bool       `json:"exhaustive"`
}

type ProcedureDefinition struct {
	Statement
	Name Identifier `json:"name"`
	Body Body       `json:"body"`
}

type ValuePush struct {
	Statement
	Value  interface{} `json:"value"`
	Target Identifier  `json:"target"`
}

type StackMove struct {
	Statement
	Left  Identifier `json:"left"`
	Right Identifier `json:"right"`
}

type ForLoop struct {
	Statement
	Iteration interface{} `json:"iteration"`
	Procedure Identifier  `json:"procedure"`
}

type MemberExpression struct {
	Statement
	Left  Identifier `json:"left"`
	Right Identifier `json:"right"`
}

type Value struct {
	Type string `json:"type"`
	Get  string `json:"value"`
}

type Identifier struct {
	Position
	Value
}

type StringLiteral struct {
	Position
	Value
}

type NumberLiteral struct {
	Position
	Value
}

func Cast(source interface{}, target interface{}) error {
	jsonStr, err := json.Marshal(source)

	if err != nil {
		return err
	}

	if err := json.Unmarshal(jsonStr, &target); err != nil {
		return err
	}

	return nil
}

func GetOperation(statement interface{}) string {
	return statement.(map[string]interface{})["operation"].(string)
}
