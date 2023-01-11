![vedia](vedia.jpg)

> Sadece vedia betik okumayın, vedia betik yazın.

> Study vedia betik, write vedia betik

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
Vedia is a stack based language where you don't have any variables, any meaningful variables that is. Expressions can still yield a value and primitive literals do exist.

## Stacks
### Create stacks

What you will start almost any program with is creating a stack where you will push or pop your values to or from. Every stack has a channel that they go to, so to create a generic variable in your memory you should create a stack at the memory channel:

```
stack your-stack-name@system:memory
```

> There are no arithmetic expressions in vedia, this allows the parser to use the "-" character in identifiers. So using a dash "-" in an identifier's name, aka kebab case, is the convention.

### Push to/Pop from stacks

After creating your stack you can push 32 bit integers to it using push operator:

```
420->your-stack-name
```

Popping a value from stack is as simple:

```
<-your-stack-name
```

### Stack channels

This operation is not an expression but a statement so it will not yield a value. Or maybe it should idk, I'll look into it later.

To create a simple hello world application you need to write to a stack that uses a standard io channel:

```
stack console@io:std
```

Vedia has string literals that represent slices of 32 bit integers so you can push multiple values to a stack at once with this notation. Just use a double quoted string as a value that goes to the stack:

```
"Hello, world!"->console
```

This will write to the standard output, meaning your terminal.

> Be sure not to use any space characters between your value and stack name. 
value->stack ✅ 
value -> stack ❌

### Stack headers

Another concept vedia has is stack headers that can store meta data that you or the runtime may need. On initilization, these values and the channel may be used in relation by the runtime engine. For instance creating a channel at `io:file` channel will require you to provide a filepath in the header. 

Header notation is basically a slice that may contain expressions including primitive values.

```
stack file@io:file ["./readme.md"]
```

You can copy one stack to another using copy operator. So you can write a contents of a file to the console.

```
stack file@io:file ["./readme.md"]
stack console@io:std

file<->console
```

## Procedures

Vedia has the core concept of function-like structures. Vedia procedures do NOT have any arguments but rather they are called upon a stack that they can use*. 

<sub>
*: I am not sure about using the stack or its values inside a procedures, I haven't thought about it yet.
</sub>

### Create procedures

You can create a procedure with the following syntax.

```
remove-values {
  <-this
  <-this
  <-this
}
```

### Call procedures
Vedia runtime provides a handful of builtin procedures that you can use to do artihmetic or stack manipulation. You can call a procedure like this:

```
remove-values{your-stack}
length{your-stack}
add{your-stack} # adds the last 2 values of the stack and yields it
```

### Exhaustive procedures
A procedure can be exhaustive meaning for the every value it reads from its given stack it also removes it. That makes the exhaustive length procedure the same as the empty procedure. Exhaustive procedures are denoted with an octothorpe "#" character.

```
len{your-stack}#
```

## For loops
To avoid repetetive tasks, I added a simple for loop mechanism. You basically provide a iteration value and point it to a procedure to run and provide a stack to call it upon.

```
for 10 your-procedure@your-stack
```

### Example
Let's write an example procedure that removes a given amount of value from the given stack.

```
# Reads from bottom up.

# 3.
pop-value {
  <-this
}

# 2.
remove {
  # let's read the last value and get rid of it and use a for loop to pop values from the stack
  for read{this} pop-value@this
}

# 1.
stack main@system:memory
"populate with random data"->main
# Lets push the amount of data we want to remove to the stack itself

3->main # remove three values, excluding this one

remove{main}

```


# Roadmap

## Syntax & Runtime
* [ ] Comments
* [ ] Member expression calls
* [ ] Memory scopes on procedure calls
* [ ] Stack channel initialization
* [x] Stack channel notification

## Stack Channels

* [X] system:memory
* [X] io:std
* [X] io:file
* [ ] net:http
* [ ] net:socket
* [ ] net:tcp

## Standart Lib

* [X] length
* [X] empty
* [ ] read

## Math Lib

* [ ] add
* [ ] subtract
* [ ] divide
* [ ] multiply
* [ ] modulo
* [ ] exp
* [ ] root
