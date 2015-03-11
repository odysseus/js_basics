if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}

var person = {
  firstName: "Grace",
  lastName: "Hopper"
};

document.writeln("Hello, world!");
document.writeln(person.firstName);
