// @ts-nocheck because we are using nearley's generated grammar
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
function id(d: any[]): any {
  return d[0];
}
declare var number_literal: any;
declare var string_literal: any;
declare var comment: any;
declare var identifier: any;

import m from "https://dev.jspm.io/moo";
const moo = m as { compile: Function; keywords: Function };
const lexer = moo.compile({
  ws: { match: /[ \t\n\r]+/, lineBreaks: true },
  at: "@",
  ampersand: "&",
  dash: "-",
  angle_left_brackets: "<",
  angle_right_brackets: ">",
  left_curly_brackets: "{",
  right_curly_brackets: "}",
  left_square_brackets: "[",
  right_square_brackets: "]",
  left_parens: "(",
  right_parens: ")",
  colon: ":",
  dot: ".",
  comma: ",",
  forward_slash: "/",
  comment: {
    match: /#(?:[^\n\\]|\\["\\ntbfr])*#/,
  },
  string_literal: {
    match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
    value: (s: string) => JSON.parse(s),
  },
  number_literal: {
    match: /-?[0-9]+(?:\.[0-9]+)?/,
  },
  identifier: {
    match: /[a-zA-Z_][a-zA-Z_0-9-]*/,
    type: moo.keywords({
      use: "use",
      stack: "stack",
      for: "for",
      expose: "expose",
      this: "this",
    }),
  },
});

import n from "https://dev.jspm.io/nearley";
const nearley = n as Nearley;

interface Nearley {
  Parser: { new (grammar: any): any };
  Grammar: { fromCompiled: (grammar: any) => any };
  Rule: { new (): any };
}

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
    { name: "top_level_statements", symbols: ["value_pop"], postprocess: id },
    { name: "top_level_statements", symbols: ["stack_move"], postprocess: id },
    { name: "top_level_statements", symbols: ["for_loop"], postprocess: id },
    { name: "top_level_statements", symbols: ["comment"], postprocess: id },
    {
      name: "create_statement$ebnf$1$subexpression$1",
      symbols: ["__", "slice_literal"],
      postprocess: (d) => d[1],
    },
    {
      name: "create_statement$ebnf$1",
      symbols: ["create_statement$ebnf$1$subexpression$1"],
      postprocess: id,
    },
    { name: "create_statement$ebnf$1", symbols: [], postprocess: () => null },
    {
      name: "create_statement",
      symbols: [
        { literal: "stack" },
        "__",
        "identifier",
        { literal: "@" },
        "ident_or_member",
        "create_statement$ebnf$1",
      ],
      postprocess: (d) => ({
        operation: "create-statement",
        name: d[2],
        at: d[4],
        header: d[5],
      }),
    },
    {
      name: "procedure_call$ebnf$1",
      symbols: [{ literal: "&" }],
      postprocess: id,
    },
    { name: "procedure_call$ebnf$1", symbols: [], postprocess: () => null },
    {
      name: "procedure_call",
      symbols: [
        "expression",
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
    { name: "expression", symbols: ["identifier"] },
    { name: "expression", symbols: ["dot_member_expression"] },
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
      symbols: ["value", { literal: "-" }, { literal: ">" }, "identifier"],
      postprocess: (d) => ({
        operation: "value-push",
        value: d[0],
        target: d[3],
      }),
    },
    {
      name: "value_pop",
      symbols: [{ literal: "<" }, { literal: "-" }, "identifier"],
      postprocess: (d) => ({ operation: "value-pop", target: d[2] }),
    },
    {
      name: "stack_move",
      symbols: [
        "identifier",
        { literal: "<" },
        { literal: "-" },
        { literal: ">" },
        "identifier",
      ],
      postprocess: (d) => ({
        operation: "stack-move",
        left: d[0],
        right: d[4],
      }),
    },
    {
      name: "for_loop",
      symbols: [
        { literal: "for" },
        "_",
        "value",
        "_",
        "identifier",
        { literal: "@" },
        "identifier",
      ],
      postprocess: (d) => ({
        operation: "for-loop",
        iteration: d[2],
        procedure: d[4],
        at: d[6],
      }),
    },
    { name: "ident_or_member", symbols: ["identifier"], postprocess: id },
    {
      name: "ident_or_member",
      symbols: ["colon_member_expression"],
      postprocess: id,
    },
    {
      name: "dot_member_expression",
      symbols: ["identifier", { literal: "." }, "identifier"],
      postprocess: (d) => ({
        operation: "member-expression",
        left: d[0],
        right: d[2],
      }),
    },
    {
      name: "colon_member_expression",
      symbols: ["identifier", { literal: ":" }, "identifier"],
      postprocess: (d) => ({
        operation: "member-expression",
        left: d[0],
        right: d[2],
      }),
    },
    { name: "slice_literal$ebnf$1", symbols: ["slice_value"], postprocess: id },
    { name: "slice_literal$ebnf$1", symbols: [], postprocess: () => null },
    {
      name: "slice_literal",
      symbols: [{ literal: "[" }, "slice_literal$ebnf$1", { literal: "]" }],
      postprocess: (d) => ({
        type: "slice-literal",
        line: d[0].line,
        col: d[0].col,
        values: d[1] || [],
      }),
    },
    { name: "slice_value", symbols: ["value"], postprocess: (d) => [d[0]] },
    {
      name: "slice_value",
      symbols: ["slice_value", "_", { literal: "," }, "_", "value"],
      postprocess: (d) => [...d[0], d[4]],
    },
    { name: "value", symbols: ["number_literal"], postprocess: id },
    { name: "value", symbols: ["string_literal"], postprocess: id },
    { name: "value", symbols: ["procedure_call"], postprocess: id },
    { name: "value", symbols: ["identifier"], postprocess: id },
    {
      name: "number_literal",
      symbols: [
        lexer.has("number_literal")
          ? { type: "number_literal" }
          : number_literal,
      ],
      postprocess: (d) => ({
        value: d[0].value,
        type: "number-literal",
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
        type: "string-literal",
      }),
    },
    {
      name: "comment",
      symbols: [
        { literal: "#" },
        "_",
        lexer.has("comment") ? { type: "comment" } : comment,
      ],
      postprocess: () => null,
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
    {
      name: "identifier",
      symbols: [{ literal: "this" }],
      postprocess: ([d]) => ({
        value: d.value,
        line: d.line,
        col: d.col,
        type: "this",
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

function parse(input: string) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
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
