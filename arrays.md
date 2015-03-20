# Arrays

Array literals:

```javascript
var empty = [];
var numbers = ['one', 2, 'three'];

empty[1] // undefined
numbers[1] // 'two'

numbers[6] = 7;
numbers.length; // 7
```

As you see accessing an index that is out of bounds does not raise an error or return nil, rather `undefined`. Assigning to an array index that is out of range resizes the array to that length rather than raising an error. Arrays can also contain arbitrary types.

The main thing to understand is that an array in JavaScript bears basically no relationship to the array structure in other languages, an array in JS is an object for which the properties are all integers:

```javascript
var numbers = [1, 2, 3];

// Internally this equates to:
// { '0': 1, '1': 2, '2': 3 }
```

As you can see from the example above, the indices are really just properties, for that reason the structure does not take up a contiguous space in memory and does not face type constraints.

Because arrays inherit from `Array.prototype` they inherit a number of methods not available to objects such as `length`.

### Appending
Can be done in two ways

```javascript
var numbers = [1, 2, 3];
numbers[numbers.length] = 4;
numbers.push(5);
```

### Deleting
Delete will remove an element, but not change the length of the array:

```javascript
delete numbers[2];
// [1, undefined, 3]
```

If you want the element removed and the array adjusted as well, use `splice`

```javascript
numbers.splice(2, 1);
// [1, 3]
```

`splice` takes an index and a number of items to delete, then it removes that many items and shifts everything left to adjust. Note that because everything is being shifted left this is an expensive operation.

### Looping

`for in` as it turns out is not a good choice for this one because it loops over all the properties of the object and could dig up some unwanted data points. The preferred way to do it is using the `for` loop.

```javascript
for (i = 0; i < numbers.length; i += 1) {
  document.writeln(numbers[i])
}
```

### Typeof

JavaScript does not properly recognize when an object is an array:

```javascript
typeof numbers
// 'object'
```

So to get around that you can use this function which checks to ensure that the variable exists, the variable is an object, and finally that the variable is an array:

```javascript
var is_array = function(value) {
  return value && typeof value === 'object' && value.constructor === Array;
};
```

Or a more generalized:

```javascript
var is_array = function(value) {
  return Object.prototype.toString.apply(value) === '[object Array]';
};
```

JavaScript, where trivial things are not...

## Methods

Like any other object we can augment the `Array.prototype`:

```javascript
Array.prototype.reduce = function(value, f) {
  var i;
  for (i = 0; i < this.length; i += 1) {
    value = f(this[i], value);
  }
  return value;
});

var data = [1, 2, 3, 4, 5]

// Using reduce to find the sum
var sum = data.reduce(0, function(a, b) {
  return a + b;
});

// Using reduce to create a total method for the instance
var data.total = function() {
  return this.reduce(0, function(a, b) {
    return a + b;
  }
});
```

Arrays are not initialized with a value, but as usual we can add that ability to the language if we need to:

```javascript
Array.dim = function(dimension, initial) {
  var a = [], i;
  for (i = 0; i < dimension; i += 1) {
    a[i] = initial;
  }
  return a;
};
```

Multidimensional arrays are conveyed by arrays of arrays:

```javascript
var matrix = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

matrix[0][0] // 0
```

Like most other things with JS the power of the language lies in the ability to add. There's not a lot of support for Arrays built in to the language but since your own code integrates the same way as builtin methods you can always just add that.
