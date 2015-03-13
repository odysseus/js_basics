## Objects

Nearly everything in JS is an object. Even simple values like strings, numbers, and booleans are object-like in the sense that they have methods defined on them. They are different in that they are immutable. JS objects are mutable collections of keys, essentially a dictionary with behavior.

JS is a prototypal language, you do not define classes and behaviors for that class. Instead you set up a single object and define attributes and behavior on that, to make another object you can use the initial object as a prototype when initializing another.

## Literals

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

## Reflection

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
  println(typeof prop)
}
```

This will not give a predictable ordering and it *will* search the prototype tree. If you want tn ensure you receive only a list of specific properties, make an array of the properties and iterate over that using `for in`. If you need those to be in the right order then iterate over them using a normal `for i=0...` loop.

## Removing Properties

Remove properties using `delete`, it will remove it from that object but not from other linked prototypes. Furthermore, deleting that might cause calls to that property to now be routed to a linked property.

```javascript
soldier.title // 'Sgt. Smith'
delete soldier.title

// However soldier was linked to the 'Person' prototype which also defines
// the property
soldier.title // 'Mr. Smith'
```

## Global Variables

JS uses global variables more than most languages but still has the same namespace problems. To avoid excessive use of the global namespace you can put everything inside of a single global object.

```javascript
var MYAPP = {}

MYAPP.formatting = {}
```

Or something in that vein...

