load(libdir + "syntax.js");

var postfixes = [
  "...foo) => 1 @",
];

function check_syntax_error(e, code) {
  assertEq(e instanceof SyntaxError, true);
}

test_syntax(postfixes, check_syntax_error, true);
