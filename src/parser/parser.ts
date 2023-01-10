// deno-lint-ignore-file no-explicit-any ban-types
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
import n from "https://dev.jspm.io/nearley";
const nearley = n as Nearley;

function id(d: any[]): any {
  return d[0];
}
declare const comment: any;
declare const number_literal: any;
declare const string_literal: any;
declare const identifier: any;

import m from "https://dev.jspm.io/moo";
const moo = m as { compile: Function; keywords: Function };

const lexer = moo.compile({
  ws: { match: /[ \t\n\r]+/, lineBreaks: true },
  at: "@",
  pound: "#",
  dash: "-",
  angle_left_brackets: "<",
  angle_right_brackets: ">",
  left_curly_brackets: "{",
  right_curly_brackets: "}",
  left_parens: "(",
  right_parens: ")",
  colon: ":",
  forward_slash: "/",
  string_literal: {
    match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
    value: (s: string) => JSON.parse(s),
  },
  number_literal: {
    match: /-?[0-9]+(?:\.[0-9]+)?/,
  },
  comment: /\\.*\\/,
  identifier: {
    match: /[a-zA-Z_][a-zA-Z_0-9-]*/,
    type: moo.keywords({
      use: "use",
      create: "create",
      for: "for",
      expose: "expose",
    }),
  },
});

interface NearleyToken {
  value: any;
  [key: string]: any;
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
}

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol =
  | string
  | { literal: any }
  | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
}

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {
      name: "main",
      symbols: ["_", "use_statements", "body"],
      postprocess: (d) => ({ uses: d[1], body: d[2] }),
    },
    { name: "use_statements$ebnf$1", symbols: [] },
    {
      name: "use_statements$ebnf$1$subexpression$1",
      symbols: ["use_statement", "_"],
      postprocess: id,
    },
    {
      name: "use_statements$ebnf$1",
      symbols: [
        "use_statements$ebnf$1",
        "use_statements$ebnf$1$subexpression$1",
      ],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    {
      name: "use_statements",
      symbols: ["use_statements$ebnf$1"],
      postprocess: id,
    },
    {
      name: "use_statement",
      symbols: [{ literal: "use" }, "_", "identifier"],
      postprocess: (d) => ({ operation: "use-statement", value: d[2] }),
    },
    { name: "body$ebnf$1", symbols: [] },
    {
      name: "body$ebnf$1$subexpression$1",
      symbols: ["top_level_statements", "_"],
      postprocess: id,
    },
    {
      name: "body$ebnf$1",
      symbols: ["body$ebnf$1", "body$ebnf$1$subexpression$1"],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: "body", symbols: ["body$ebnf$1"], postprocess: id },
    {
      name: "top_level_statements",
      symbols: ["create_statement"],
      postprocess: id,
    },
    {
      name: "top_level_statements",
      symbols: ["procedure_definition"],
      postprocess: id,
    },
    {
      name: "top_level_statements",
      symbols: ["procedure_call"],
      postprocess: id,
    },
    { name: "top_level_statements", symbols: ["value_push"], postprocess: id },
    { name: "top_level_statements", symbols: ["stack_move"], postprocess: id },
    { name: "top_level_statements", symbols: ["for_loop"], postprocess: id },
    {
      name: "comment",
      symbols: [lexer.has("comment") ? { type: "comment" } : comment],
    },
    {
      name: "create_statement",
      symbols: [
        { literal: "create" },
        "__",
        "identifier",
        "__",
        { literal: "@" },
        "__",
        "ident_or_member",
        "__",
        "header_define",
      ],
      postprocess: (d) => ({
        operation: "create-statement",
        name: d[2],
        at: d[6],
        header: d[8],
      }),
    },
    {
      name: "header_define$ebnf$1",
      symbols: ["string_literal"],
      postprocess: id,
    },
    { name: "header_define$ebnf$1", symbols: [], postprocess: () => null },
    {
      name: "header_define",
      symbols: [{ literal: "<" }, "header_define$ebnf$1", { literal: ">" }],
      postprocess: (d) => d[1],
    },
    {
      name: "procedure_call$ebnf$1",
      symbols: [{ literal: "#" }],
      postprocess: id,
    },
    { name: "procedure_call$ebnf$1", symbols: [], postprocess: () => null },
    {
      name: "procedure_call",
      symbols: [
        "identifier",
        { literal: "{" },
        "identifier",
        { literal: "}" },
        "procedure_call$ebnf$1",
      ],
      postprocess: (d) => ({
        operation: "procedure-call",
        name: d[0],
        target: d[2],
        exhaustive: d[4] !== null,
      }),
    },
    { name: "procedure_definition$ebnf$1", symbols: [] },
    {
      name: "procedure_definition$ebnf$1$subexpression$1",
      symbols: ["top_level_statements", "_"],
      postprocess: id,
    },
    {
      name: "procedure_definition$ebnf$1",
      symbols: [
        "procedure_definition$ebnf$1",
        "procedure_definition$ebnf$1$subexpression$1",
      ],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    {
      name: "procedure_definition",
      symbols: [
        "identifier",
        "_",
        { literal: "{" },
        "_",
        "procedure_definition$ebnf$1",
        { literal: "}" },
      ],
      postprocess: (d) => ({
        operation: "procedure-definition",
        name: d[0],
        body: d[4],
      }),
    },
    {
      name: "value_push",
      symbols: [
        "value",
        "_",
        { literal: "-" },
        { literal: ">" },
        "_",
        "identifier",
      ],
      postprocess: (d) => ({
        operation: "value-push",
        value: d[0],
        target: d[5],
      }),
    },
    {
      name: "stack_move",
      symbols: [
        "identifier",
        "_",
        { literal: "<" },
        { literal: "-" },
        { literal: ">" },
        "_",
        "identifier",
      ],
      postprocess: (d) => ({
        operation: "stack-move",
        left: d[0],
        right: d[6],
      }),
    },
    {
      name: "for_loop",
      symbols: [{ literal: "for" }, "_", "value", "_", "identifier"],
      postprocess: (d) => ({
        operation: "for-loop",
        iteration: d[2],
        procedure: d[4],
      }),
    },
    { name: "ident_or_member", symbols: ["identifier"], postprocess: id },
    {
      name: "ident_or_member",
      symbols: ["member_expression"],
      postprocess: id,
    },
    {
      name: "member_expression",
      symbols: ["identifier", { literal: ":" }, "identifier"],
      postprocess: (d) => ({
        operation: "member-expression",
        left: d[0],
        right: d[2],
      }),
    },
    { name: "value", symbols: ["number_literal"], postprocess: id },
    { name: "value", symbols: ["string_literal"], postprocess: id },
    { name: "value", symbols: ["procedure_call"], postprocess: id },
    {
      name: "number_literal",
      symbols: [
        lexer.has("number_literal")
          ? { type: "number_literal" }
          : number_literal,
      ],
      postprocess: (d) => ({
        value: d[0].value,
        type: "number_literal",
        line: d[0].line,
        col: d[0].col,
      }),
    },
    {
      name: "string_literal",
      symbols: [
        lexer.has("string_literal")
          ? { type: "string_literal" }
          : string_literal,
      ],
      postprocess: ([d]) => ({
        value: d.value,
        line: d.line,
        col: d.col,
        type: "string_literal",
      }),
    },
    {
      name: "identifier",
      symbols: [lexer.has("identifier") ? { type: "identifier" } : identifier],
      postprocess: ([d]) => ({
        value: d.value,
        line: d.line,
        col: d.col,
        type: "identifier",
      }),
    },
    { name: "_$ebnf$1", symbols: [] },
    {
      name: "_$ebnf$1",
      symbols: ["_$ebnf$1", /[\s]/],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: "_", symbols: ["_$ebnf$1"], postprocess: () => null },
    { name: "__$ebnf$1", symbols: [/[\s]/] },
    {
      name: "__$ebnf$1",
      symbols: ["__$ebnf$1", /[\s]/],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: "__", symbols: ["__$ebnf$1"], postprocess: () => null },
  ],
  ParserStart: "main",
};

interface Nearley {
  Parser: { new (grammar: any): any };
  Grammar: { fromCompiled: (grammar: any) => any };
  Rule: { new (): any };
}

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

function parse(input: string) {
  try {
    parser.feed(input);
    if (!parser.results[0]) {
      return { message: "fail", error: "we do not know", result: null };
    }

    return { message: "success", error: null, result: parser.results[0] };
  } catch (e) {
    return { message: "fail", error: e, result: null };
  }
}

const parsed = parse(Deno.args[0]);

console.log(JSON.stringify(parsed));
