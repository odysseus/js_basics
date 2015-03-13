# Inheritance

Being a prototypal language objects inherit behavior directly from other objects and not from a class. This section looks at design patterns you can use with JS.

## PseudoClassical
`prototype` is a property of all objects that acts as a dropbox for adding behavior to objects of that class.

To explore this first we define a class:

```javascript
var Animal = function(name, says) {
  this.name = name;
  this.says = says;
}
```

then we can define some behavior on that class:

```javascript
Animal.prototype.speak = function() {
  return this.says;
}
```

To make an instance with this approach use the `new` command:

```javascript
var cow = new Animal('Cow', 'Moo');
var cow_says = cow.speak() // 'Moo'
```

We can define more objects and set these up to inherit from `Animal`

```javascript
var Cat = function(name) {
  this.name = name;
  this.says = "meow";
};

// Now replace the prototype with a new instance of Animal
Cat.prototype = new Animal();

// We gain all the methods Animal had along with the ability to add more
Cat.prototype.lash_out = function() {
  return "Raaaaawr!";
};

// Additionally methods you add to Animal will be available
// on Cat because the prototypes are linked
Animal.prototype.chew = function() {
  return "NomNom";
};

var cleo = Cat('Cleo');
cleo.chew() // 'NomNom'
```

So that's the basic pattern and you may see people using it so it's worth being familiar. However the caveats are manifold and despite a passing similarity to classical OO programming it's still not that. Better to follow idiomatic JS patterns and prototypal OO rather than couching it in this paradigm.

## Prototypal

As the term suggests prototypal inheritance is based not on a spec but a prototype. Another way to think of it is clone based classes, you take an object that exists and copy its attributes and behavior into a new one.

The first step is to make an object literal

```javascript
var person = {
  name: 'Doug',
  hobbies: ["skiing"],
  greet: function() {
    return "Hi, I'm" + (this.name || "a person") + "!";
  },
  list_hobby: function() {
    return "I enjoy " + (this.hobbies[0] || "nothing") + "!";
  }
};
```

With this prototype in place we can make more of them using `Object.create`

```javascript
var dave = Object.create(person);
```

Keep in mind that the new object, while occupying a different space in memory, is *identical* in every other way to the object it was created from:

```javascript
println(person.greet());
// Hi, I'm Doug!
println(person.list_hobby());
// I enjoy skiing!

println(dave.greet());
// Hi, I'm Doug!
println(dave.list_hobby());
// I enjoy skiing!
```

So to make use of the new object we have to customize it:

```javascript
var dave = Object.create(person);
dave.name = "Dave";
dave.hobbies = ["Netflix"];

println(dave.greet());
// Hi, I'm Dave!
println(dave.list_hobby());
// I enjoy Netflix!
```

Because the objects distinguished by their differences this is called "differential inheritance". Further, because all of the properties will inherit, and not just the behavior, it's good form to have creator functions that set all the attributes and take a hash/object as opposed to a list of arguments for two reasons: 1) With many attributes remembering the ordering of everything can be difficult, whereas an object/hash allows named attributes. And 2) Initializing objects through JSON becomes trivial when the constructor takes an object rather than a list of args.

## Functional

The two patterns we've looked at so far work fine for creating objects but have the weakness that all of their properties are visible and mutable to anyone. This can be solved by convention if you assume that all programmers using your code will comply with it, but sometimes you need stronger assurances than that.

Functional programming offers a solution using a pattern similar to the modules pattern we saw above. In this case you take a `spec` object of a certain type and hold that value in a closure. Then you return what is basically a module object that interacts with the original spec object only through a set of predefined methods. An example:

```javascript
var secret_animal = function(spec) {
  var that = {};

  that.name = function() {
    return spec.name;
  };

  that.speak = function() {
    return spec.says;
  };

  return that;
};

var cow = new Animal('cow', 'moo');
var secret_cow = secret_animal(cow);

cow.speak();          // 'moo'
secret_cow.speak();   // 'moo'
```

In this pattern none of the properties of the underlying object `spec` are visible from the returned object `that`. This is made clear when inspecting them in a browser:

```javascript
cow
Animal {name: "cow", says: "moo", speak: function, chew: function}

secret_cow
Object {name: function, speak: function, type: function, define_method: function}
```

As you can see `secret_cow` is just the collection of functions we used to access the properties. Pretty handy. It retains its links to the underlying object as well so changes in that are reflected in the protected object, although if you're following this pattern odds are you don't want the original object changed directly anyway so it's uncertain whether that's a bug or a feature.

## Composition

Finally we can compose objects by passing them to functions that add specific features. Consider an example of logging features:

```javascript
function loggable(obj) {
  obj.logfile = "somelogfile.txt";
  obj.logfn = function(fname, args) {
    // log stuff
    obj.fname.apply(args);
  }
  return obj;
}
```

This is a very barebones concept but you get the general idea. You can pass in any object and have it receive a new set of behaviors that are localized to that instance. Or if this is a common pattern that you want all kinds of things to have run the function on a prototype and then clone the hell out of it. Because the implementation details are in one place you don't need to fiddle with adjusting the code on a dozen different methods across classes.

