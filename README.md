# JavaScript Basics

### Output
Typically JS is not run from the command line so the best bet is to have an empty html page with the script loaded, and to print the output to that page. This custom `println` function can help with that:

```javascript
function println(str) {
  document.writeln(str);
}
```

Not wildly different but if you want bigger output you can wrap the `str` in other html elements like so: `document.writeln("<h3>" + str + "</h3>");`

This document will use `println` for brevity to indicate all output.

### Numbers

- There's one type of number that encompasses all sizes, both integer and float. Internally this is represented as a float64
- A leading `0` denotes an octal number
- A leading `0x` denotes a hex number
- `e` can be used for for power of 10, eg: `1e2 == 100`
- `NaN` is ironically a numeric value that results from an operation that cannot output a result. You can test for this using `isNaN(n)`
- `Infinity` represents all values that exceed the min/max of a float64, functions like mathematical infinity as well
- To ensure int-like operations use `Math.floor(n)`


### Strings

- Double quoted and single quoted are both valid, there is no distinction between the two types
- No char class, instead use a single item string
- Once created strings are immutable, but can be concatenated.
- Chars are 16bits wide, development occurred when UTF-16 was the standard
- Escapable chars: `" ' \ / b f n r t`
- Code points can be specified directly using `u0041`

### Statements

- `var` declares a variable
- `switch`, `while`, `for`, and `do` for initiating loops, can all take an optional label to allow breaking to that point
- `break`, `return`, and `throw`, for disrupting loops


### Truthiness

__Falsy Values__

- `false`
- `null`
- `undefined`
- Empty string `''`
- Zero `0`
- `NaN`

All other values are true

### Loops

For loop variants:

`for (i=0; i<10; i++) {...`

Also:

`for (key in obj) {...`

Do while:

```javascript
do {
	// do block
} while (condition)
```

Because the condition is tested at the end, the block will always execute at least once.

Try/Catch:

```javascript
try {
	// try block
} catch (exception) {
	// catch block
}
```

### Operator Precedence

1. Refinement/invocation: `. [] ()`
2. Unary: `delete new typeof + - !`
3. Math and modulo: `* / %`
4. Mo Math: `+ -`
5. Inequality: `>= <= > <`
6. Equality: `=== !==`
7. Logical AND: `&&`
8. Logical OR: `||`
9. Ternary: `?:`

### Literals

- Numbers: `37`
- Strings: `"literal"`
- Objects: `{ attr: value }`
- Arrays: `[1, 2, 3, 4]`
- Regexp: `/regex/gim`

### Functions

Function literal:

```javascript
function square(val) {
  // var statements
  var fin

  // statements
  fin = val * val

  // return
  return fin
}
```

