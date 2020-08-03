# foreach
Helper function `foreach` with massively extended functionality.

### Syntax: 
```javascript
foreach( MULTI set :iterable value:, FUNCTION callback([value [, index [, self [, iterations]]]]) {...} , BOOLEAN use_dynamic_length, MULTI modify_this_scope);

Simplified: foreach(set, callback([value [, index [, self [, iterations]]]])[, dynamiclength][, thisArg]);
```
```javascript
// Examples:

foreach([1,2,3], function(value, index, self, iterations) { 
    console.log(value, index, self, iterations); 
});

// 1, 0, [1,2,3], 0
// 2, 1, [1,2,3], 1
// 3, 2, [1,2,3], 2
```
Foreach can be used just like regular `for` loops:

```javascript
console.time('foreach');

foreach(4000000, function(v){ if (v > this-3) { console.log('!', v); } });

console.timeEnd('foreach');
// ! 3999998
// ! 3999999
// foreach: 53.448974609375ms (yup, its quite fast)

// assuming there are only 2 'div's on the page:
foreach ( document.querySelectorAll('div'), function(value, index, self, count) {
   console.log(this, value, index, self, count);
});

// NodeList(2), <div></div>, 0, NodeList(2), 0
// NodeList(2), <div></div>, 1, NodeList(2), 1


var s = foreach([6,5,4], function(v, i) {
    this[i] = 0;
}); 
console.log(s); // [0,0,0]

console.log(foreach(false), foreach(0), foreach(NaN), foreach(null), foreach(''), foreach(undefined)); // all `undefined`
```

#### this

The `this` scope of your function. Except for string sets, the `this` scope is always set as your set. For strings, `this` is set to an array form of the string.

#### value

The current value in your set that you're iterating over. For number iterations, `value` is always the same as `index`.

#### index

The index that you're currently at in your set. `foreach` allows you to jump to a specific index by returning certain values from your callback function.

#### self

Your collection.

#### count / iterations

The number of times that your callback function has executed. Unlike index, this value cannot be modified. 
Useful if you're jumping back and forth between indexes, but want to make sure that your function only runs a specific number of times.

-----

`foreach` returns your set after it has finished looping over it. For falsy sets, `foreach` does not execute, and returns `undefined`.

Breaking out of loops:
-----

You can instantly break out of any `foreach` loop at any time by returning `false` within your callback function.

```javascript
foreach ([1,2,3,4,5,6] , function (value, index) {
   console.log(value, index);
   if (value === 4) { return false }
});

// 1, 0
// 2, 1
// 3, 2
// 4, 3
```
You can return other values besides `false`. Returning `true` or the string `'continue'` is equivalent to calling the `continue` statement.
 
 ```javascript
 
 foreach (7, function(v,i,s,count) { 
     if (i === 2) { return true } 
     if (i === 5) { return }
     console.log(v,i,s,count);
  });
 
 // 0, 0, 7, 0
 // 1, 1, 7, 1
 // 3, 3, 7, 2
 // 4, 4, 7, 3
 // 6, 6, 7, 5
 ```
Note that `count` is not updated whenever you return `'continue'` or `true`, as `foreach` will assume that you skipped over executing your function. If you simply return without specifying a value, `count` is updated as well.

#### For numbers, `value` is always the same as `index`.

Dynamic Iteration:
-----
Sometimes you want to iterate over a value while conditionally modifying the value itself. By default, your set's `.length` is created / stored on initialization so as not to create infinite loops, but you can set `dynamiclength` to `true` to continually check the `.length` as you go. But be careful, your loop can run indefinitely if you never return `false` within your callback, or if `foreach.maxIterations` is not set as a failsafe. Dynamic iteration has no effect on numbers, as set `.length` will be initialized to the number given.

```javascript
// An example with stored length. This is the default functionality.
var k = foreach([1,2,3], function(v,i) { 
    this.push( i )
});

console.log(k); // [1,2,3,0,1,2]

// An example with dynamic length
var k = foreach([1,2,3], function(v, index) {
   this.push( index );
   if (index > 4) { return false } 
}, true);

console.log(k); // [1,2,3,0,1,2,3,4,5]

var k = foreach(400, function(v) {
    console.log( this-v ); // 400, 399, 398, ..., 2, 1
}, true); // useless

console.log(k); // 400
```

### More on strings:

As strings are immutable, `foreach` internally splits strings to array form, and sets `this` as that internal array, for easy manipulation.

```javascript
var str = foreach('ABCDE', function(v,i,s) {
   console.log(v,i,s); 
   if (!i) { console.log(this, this[i]) } // ["A","B","C","D","E"], "A"
   this[i] += i;
});

// if `this` was `ABCDE` instead, 
// this action would silently fail (or in strict mode, throw an error)

// A, 0, ABCDE
// B, 1, ABCDE
// C, 2, ABCDE
// D, 3, ABCDE
// E, 4, ABCDE

console.log(str); // A0B1C2D3E4
```
Once `foreach` is done iterating over the string-array, it internally `joins` the array back into a `String` and returns that string.

#### Caveat for strings:
For now, do not use `foreach` for strings containing surrogate pairs, as foreach `splits` & `joins` by `''` which defaults to UTF-16 codeunits, which destroy surrogate pairs.
