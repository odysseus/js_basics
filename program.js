//if (typeof Object.create !== 'function') {
  //Object.create = function (o) {
    //var F = function () {};
    //F.prototype = o;
    //return new F();
  //};
//}

// Improving printing on simple scripts
function println(str) {
  document.writeln("<h3>" + str + "<h3>");
}

// Object literal
var person = {
  firstName: "Grace",
  lastName: "Hopper"
};

// Function literal
function add(x, y) {
  return x + y;
}

// Closure
function counter() {
  var c = 0;
  return function() {
    return c++;
  }
}

function sum() {
  var sum = 0;
  for (i=0; i<arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}

// Monkey patching onto the object base type
Object.prototype.sayPotato = function() {
  println("Potato!");
};

Object.prototype.type = function() {
  return typeof this;
};

// Monkey patching to allow a define_method method
Object.prototype.define_method = function(name, func) {
  this.prototype[name] = func;
  return this;
};

Number.define_method('integer', function() {
  return Math[this < 0 ? 'ceil' : 'floor'](this);
});
var x = 3.14;

// Examples of function scope
var scope = function() {
  var a = 1;
  var b = 2;

  // Calling inc at the end causes this to function as a block
  var inc = function() {
    var c = b;
    b = a + b;
    a = b - a;
  }();

  println(a + " " + b);
};

// Using closures to save state
var nextFibo = function() {
  var a = 0;
  var b = 1;

  return function() {
    b = a + b;
    a = b - a;
    return b;
  };
};

// Using closures to hide state
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

// Currying
Function.prototype.curry = function() {
  var slice = Array.prototype.slice;
  var arga = slice.apply(arguments);
  var self = this;
  return function() {
    var argb = slice.apply(arguments);
    return self.apply(null, arga.concat(argb));
  };
};

// Partially evaluated add that now takes one argument and adds one
var inc = add.curry(1);

// Memoization
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


// Print statements
println("Hello, world!");
var seq = makeSeq(0);
seq.next();
seq.next();
seq.next();
seq.next();
seq.next();
println(seq.value());
println(inc(7));
println(fibo(10));
