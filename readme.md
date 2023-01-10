# Getting Started

## Requirements

Deno 1.28.1+ [Deno — A modern runtime for JavaScript and TypeScript](https://deno.land/)

Golang 1.19+ [The Go Programming Language](https://go.dev/)

Taskfile 3+ [Taskfile](https://taskfile.dev/) (optional)

## Compile

If you have taskfile you can use the tool for compilation

```
task build-parser
task build
```



Alternatively, you can compile without the taskfile tool

First compile the parser

`deno compile -o ./src/parser/parser ./src/parser/parser.ts`

Then compile the runtime

`go build -ldflags="-s -w" `

## Run

Specify a target file and execute the runtime

`./vedia main.vd`

# The Language
