# ![vedia](https://file+.vscode-resource.vscode-cdn.net/Users/muhammedalican/Documents/repos/vedia/vedia.jpg)Getting Started

## Requirements

Deno 1.28.1+

Golang 1.19+

## Compile

First compile the parser

`deno compile -o ./src/parser/parser ./src/parser/parser.ts`

Then compile the runtime

`go build -ldflags="-s -w" `
