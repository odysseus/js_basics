# Functions

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

## Invocation and `this`

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
println(myObject.value);
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

## Variadic Functions

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

## Return

`return` specifies the return value of a function. Like Ruby all functions return a value, unlike Ruby that return is not implicit. When it is not defined it returns `undefined`, pretty logical huh!?

One exception, if the function is invoked using `new` prefix it will always return the object created, even if the return value of the function was not an object.


## Exceptions

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
    println(e.name + ": " + e.message);
  }
};
```

Unlike the same pattern in other languages this cannot be used to catch specific exceptions. If you need special handling for the type of exception you will need to do it within the `catch` block by inspecting the object.

## Augmenting Types

JS also allows "type augmentation" or monkey patching. Every type has a prototype, by adding a method directly to this prototype it becomes available to all objects of that type. By adding to a base type like `Object` or `Function` it becomes available to all objects or functions:

```javascript
Object.prototype.sayPotato = function() {
  println("Potato!");
};
```

Note that all objects previously defined will still be affected by this. Because *everything* inherits from `Object` this can have rather insane side-effects:

```javascript
function add(x, y) {
  return x + y
}

add.sayPotato();
// Potato!
```

But it can be used to add features to the language, the following example adds a `method` method to the object base class so you don't have to call `prototype` each time, then uses that to define a method on `Number` that returns an integer value.

```javascript
Object.prototype.method = function(name, func) {
  this.prototype[name] = func;
  return this;
};

Number.method('integer', function() {
  return Math[this < 0 ? 'ceil' : 'floor'](this);
});
```

Cool pattern, although it adds some external complexity and doesn't really save *that* much time, but it shows the possibilities.

Actually, because this feature is available to everyone it's good practice to make sure that the method doesn't already exist before redefining it. That said, as defensive mechanisms go it kinda misses the point. If you're trying to add a method it's for specific functionality, simply not adding the method by using a conditional will prevent breaking other libraries, but it might break yours.

## Scope

JavaScript does **NOT** have block scope. For this reason it is recommended that you declare all variables at the top of the function. JavaScript does have function scoping. Basically, an inner function can read a variable from an enclosing scope and modify it *internally*, however, if that function ends and the variable continues to exist beneath it that variable will revert to the value from its scope. An example:

```javascript
var outer = function() {
  var a = 1;

  var inner = function() {
    var b = 2;
    // a exists and is equal to 1
    a += b;
    // a exists and is now equal to 3
  };

  // a exists and is back to 1 now because the function assigned
  // to inner has not been called in this scope
  // b does not exist in this outer scope

  inner();
  // After the function call a is equal to 3
  // b still does not exist in this scope as it was declared in inner
};
```

## Closures

As we've already mentioned, though, nested functions *do* gain access to their outer contexts and can be used as closures:

```javascript
var nextFibo = function() {
  var a = 0;
  var b = 1;

  return function() {
    b = a + b;
    a = b - a;
    return b;
  };
};
```

A more interesting use of closures is to return an object literal with an attribute that is stored in the enclosing scope rather than as a property on the object itself. An example of that is given under "Modules".

```javascript
var counter = (function() {
  var value = 0;

  return {
    increment: function(inc) {
      value += typeof inc === 'number' ? inc : 1;
    },
    getValue: function() {
      return value;
    }
  };
}());
```

## Callbacks

Many functions can be called asynchronously and take a callback function to call when the main function completes:

```javascript
send_request(request, function(response) {
  display(response);
});
```

## Modules

Functions and closures can be used to hide implementation details in a module-like fashion. Suppose you had configuration variables that you wanted to store in an object for a function that would be invoked often. Storing it in the function itself involves creating that object every time the function is run and destroying it at the end which adds an unnecessary runtime cost since the object is never modified. On the other hand, putting it in a global variable clutters the global namespace and is just bad form.

By calling the function from a closure and storing the config in the outer function, you ensure that the object is only created the first time it's called but retains the same behavior as a normal function call from the user's perspective.

```javascript
Object.prototype.newFn = function() {
  var config = {
    place: "config",
    info: "here"
  };

  return function() {
    // You can use all the variables from the closure in this function, by
    // invoking it at the end the behavior from the user's standpoint is the
    // same as if the closure had not been there.
  }();
```

Similarly, the 'hidden but accessible' nature of the outer variables makes it a good choice for implementing things like ID's and sequences where the variable storing the current value should not be changed manually and can not be compromised.

```javascript
function makeSeq(start) {
  var current = start;
  return {
    value: function() {
      return current;
    },
    next: function() {
      current++;
    }
  };
}
```

In the return object the value of current is a variable within the closure and not a property of the object so it cannot be accessed by any means other than the defined set of methods on the object.

## Cascade

On methods that perform an action but do not return a value the return value is typically not used and returns `undefined`. By returning `this` instead we enable a method chaining technique known as "cascade"

```javascript
getElement('myBoxDiv')
    .move(350, 150)
    .width(100)
    .height(100)
    .color('red')
    .border('10px outset')
    .padding('4px')
    .appendText("Please stand by")
    .on('mousedown', function (m) {
        this.startDrag(m, this.getNinth(m));
    }).
    .on('mousemove', 'drag')
    .on('mouseup', 'stopDrag')
    .later(2000, function (  ) {
        this
            .color('yellow')
            .setHTML("What hath God wraught?")
            .slide(400, 40, 200, 200);
    })
    .tip("This box is resizeable");
```

What's happening here is that each method changes the DOM element in some way, and then returns the element at the end, because of that we can immediately call another subroutine-like method on it, and do many of them in succession. The resulting code is cleaner and clearer.

## Currying

Currying/partial evaluation is not built in by default but we can add it:

```javascript
Function.prototype.curry = function() {
  var args = arguments, self = this;
  return function() {
    return self.apply(null, args.concat(arguments));
  };
};
```

This holds the original value of `this` and the original value of `arguments` in a closure using `self` and `args` respectively. That allows us to give arguments to a function and return one that is partially evaluated.

```javascript
function add(x, y) {
  return x + y;
}

var inc = add.curry(1);
println(inc(6));
```

## Memoization

Memoization using a recursive fibonacci function:

```javascript
var fibo = (function() {
  var memo = [0, 1];
  var fib = function(n) {
    var result = memo[n];
    if (typeof result !== 'number') {
      result = fib(n-1) + fib(n-2);
      memo[n] = result;
    }
    return result;
  };
  return fib;
}());
```

So we invoke a function that creates an array for remembering values and stores a function that calculates them, then returns that function. Calls to that function will store computed values in the closure and search for them there first, if it does not find them it will compute the value itself using the recursive solution.

