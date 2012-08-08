var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('parser.peg', 'utf-8');
// Show the PEG grammar file
// console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
assert.deepEqual( parse("a b (c)"), ["a", "b", ["c"]]);
// allow any whiteSpace
assert.deepEqual( parse("a   b"),["a","b"]);
assert.deepEqual( parse("  a"),['a']);
// // allow any whiteSpace around parentheses
assert.deepEqual( parse("a   b    (c)"),["a","b",["c"]]);
// // allow new line
assert.deepEqual( parse("a   b    \n(c)"),["a","b",["c"]]);
// // allow new tab
assert.deepEqual( parse("a   \tb    \n(c)"),["a","b",["c"]]);
// shorcut quotes
assert.deepEqual( parse("'x"),[['quote','x']]);
assert.deepEqual( parse("'(1 2 3)"),[['quote',['1','2','3']]]);
// comments
assert.deepEqual( parse("1 2;;'(1 2 3)\n"),['1','2']);

