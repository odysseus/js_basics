# JavaScript

## Basics

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

## Objects

Nearly everything in JS is an object. Even simple values like strings, numbers, and booleans are object-like in the sense that they have methods defined on them. They are different in that they are immutable. JS objects are mutable collections of keys, essentially a dictionary with behavior.

JS is a prototypal language, you do not define classes and behaviors for that class. Instead you set up a single object and define attributes and behavior on that, to make another object you can use the initial object as a prototype when initializing another.

### Literals

```javascript
var empty_obj = {}

var person = {
  "fistName": "Grace",
  "lastName": "Hopper"
};
```

Property names can be any string. Quotes around a property name are optional since all the names are strings anyway.

```javascript
var person = {
  firstName: "Grace",
  lastName: "Hopper"
}
```

Objects can include other objects:

```javascript
var flight = {
  airline: "PanAm",
  flightNumber: 270,
  depart: {
    airport: "DIA",
    time: "2014-03-16 15:30"
  },
  arrival: {
    airport: "LAX"
    time: "2014-03-16 18:30"
  }
};
```

Variable retrieval can be done either with a dictionary-like syntax or using dots

```javascript
person["firstName"]
```

If a value doesn't exist you get `undefined`. Assigning to an object without that attribute simply adds that attribute.

### Reflection

__typeof__

Use `typeof` to find the type of anything

```javascript
typeof flight.number // 'number'
typeof flight.toString // 'function'
```

As the second example shows, just remember what you're actually calling

__hasOwnProperty__

`hasOwnProperty` checks to see if the object in question has a particular property.

```javascript
flight.hasOwnProperty('number') // true
flight.hasOwnProperty('banana') // false
```

Note that this doesn't search the inheritance tree for that property.

__for in__

The `for in` loop can be used to iterate over the properties of an object

```javascript
for (prop in flight) {
  document.writeln(typeof prop)
}
```

This will not give a predictable ordering and it *will* search the prototype tree. If you want tn ensure you receive only a list of specific properties, make an array of the properties and iterate over that using `for in`. If you need those to be in the right order then iterate over them using a normal `for i=0...` loop.

### Removing Properties

Remove properties using `delete`, it will remove it from that object but not from other linked prototypes. Furthermore, deleting that might cause calls to that property to now be routed to a linked property.

```javascript
soldier.title // 'Sgt. Smith'
delete soldier.title

// However soldier was linked to the 'Person' prototype which also defines
// the property
soldier.title // 'Mr. Smith'
```

### Global Variables

JS uses global variables more than most languages but still has the same namespace problems. To avoid excessive use of the global namespace you can put everything inside of a single global object.

```javascript
var MYAPP = {}

MYAPP.formatting = {}
```

Or something in that vein...

## Functions

There are two common ways to define functions:

```javascript
// First
var name = function(args) {
  body;
};

// Second
function name (args) {
  body;
}
```

There are a few differences here. The first form is an anonymous function that has been assigned to a named variable. The second form is a named function. Anonmyous functions are defined at runtime, whereas named functions are defined at parse time. Named functions gain some functionality, such as `toString()` and a few other methods... The nuances of the two forms are beyond the scope of this quick overview, but in a nutshell use named functions when you want to reuse it in other parts of the program, and use anonymous functions for object methods and one-shot function calls. More info [here](http://www.permadi.com/tutorial/jsFunc/index.html).

Functions have four parts. First the declaration `function`, next an optional `name`, third, the list of `args` and finally the function `body` itself. Why JS includes superfluous spaces where no other language has them is another issue for another time.

Functions are first class, they can be properties of an object and they can be passed as arguments. They can be nested inside another function. When nested the function inherits the namespace of the function above it (with one notable exception listed below). Nested functions also act as a closure.

```javascript
function counter() {
  var count = 0;
  return function() {
  };
}
```

### Invocation and `this`

Every function receives two additional parameters in addition to what it was called with, `this` and `arguments`. There are four patterns that set the value of `this`

- **Method Invocation**: Functions stored as properties of an object are 'methods', when a method is invoked `this` is set to the invoking object.
- **Function Invocation**: Non-method function invocations bind `this` to the global object. _This applies to **all** non-method functions_ and leads to some stupid behavior when the function call is contained inside a method because that function will bind to the global object and not the containing object. There is a common pattern to work around this:

```javascript
myObject.double = function() {
  // Store `this` to use in the helper function
  var self = this;

  var helper = function() {
    self.value = add(self.value, self.value)
  };

  helper();
};

myObject.double();
document.writeln(myObject.value);
```

- **Constructor Invocation**: JS has a constructor-like syntax which is honestly just best to avoid and use JS as a prototypal language as it was intended. Nonetheless, when this pattern is used `this` is set to the value of the newly created object.
- **Apply Invocation**: Functions are also objects and have methods, one of which is `apply`. Apply allows us to pass the value of `this` and an array of args and to run the function that way. Examples are really needed to explain this:

```javascript
function add(x, y) {
  return x + y;
}

// We will use these args to call add
var args = [3, 4];
// The first argument is the value of `this`, because this it not
// a method we supply null
var sum = add.apply(null, args);
// 7

// Now using an object for the value of `this`
var nameObj = {
  name: 'Dave'
};

var name = Person.prototype.get_name.apply(nameObj);
// Dave

// Note that we don't pass other args because it has none, and we can pass
// nameObj even though it has no relation to Person. In other words we can
// force using an arbitrary value of `this` this way
```

### Variadic Functions

All functions are automatically supplied with the `arguments` object listing all the arguments passed during the function call. This can be used to write variadic functions.

```javascript
function sum() {
  var sum = 0;
  for (i=0; i<arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}
```

Unfortunately `arguments` is not an actual array it's just an object that's _like_ an array. It has a `length` but no other array methods. You know, JavaScript.

### Return

`return` specifies the return value of a function. Like Ruby all functions return a value, unlike Ruby that return is not implicit. When it is not defined it returns `undefined`, pretty logical huh!?

One exception, if the function is invoked using `new` prefix it will always return the object created, even if the return value of the function was not an object.


### Exceptions

Exceptions are thrown using `throw` and returning an object that contains information about the error.

```javascript
function add(a,b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw {
      name: 'TypeError',
      message: 'Both arguments must be a number'
    };
  };
  return a + b;
}
```

`name` and `message` are standard errors, but it can be given more.

Catching exceptions is done with `try...catch`:

```javascript
var failfn = function() {
  try {
    add("seven", "eight");
  } catch (e) {
    document.writeln(e.name + ": " + e.message);
  }
};
```


