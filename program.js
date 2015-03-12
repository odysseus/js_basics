if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}

function println(str) {
  document.writeln("<h3>" + str + "<h3>");
}

var person = {
  firstName: "Grace",
  lastName: "Hopper"
};

function add(x, y) {
  return x + y;
}

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

// Print statements
println("Hello, world!");

var c = counter();
c();
c();
println(sum(1, 2, 3, 4));
