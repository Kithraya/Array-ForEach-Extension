# foreach
Helper function `foreach` with massively extended functionality.

### Syntax: 
```javascript
foreach( MULTI set (any iterable value), FUNCTION callback([value [, index [, self [, iterations]]]]) {...} , BOOLEAN use_dynamic_length, MULTI modify_this_scope);

=> foreach(set, callback([value [, index [, self [, iterations]]]])[, dynamiclength][, thisArg]);
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
You can `break` and `continue` out of `foreach` by returning `false` and `true`, respectively. Example:
```javascript
foreach([1,2,3,4,5,6,7], function(v) {
    console.log(v);
    
    if (v === 2) { return true }
    if (v === 6) { return false }
});

// 1, 2, 4, 5, 6
```

Foreach can also iterate backwards over any set, with the `options` parameter as `-1`.
```javascript
foreach([1,2,3,4,5,6,7], function(value, index) {
    console.log(value, index);
    if (value === 6 || value === 3) { return true }
}, -1);

// (value, index) => (7, 6), (6, 5), (4, 3), (3, 2), (1, 0)

```

Foreach can be used just like regular `for` loops. For `Number` sets, `value` is always the same as `index`.

```javascript
console.time('foreach');

foreach(4000000, function(v,i){ if (v > this-3) { console.log('!', v, i); } });

console.timeEnd('foreach');
// ! 3999998, 3999998
// ! 3999999, 3999999
// foreach: 53.448974609375ms (yup, its quite fast)
```

Foreach works on arraylike objects:
```javascript
// assume 2 divs on the page:
foreach ( document.querySelectorAll('div'), function(value, index, self, count) {
   console.log(this, value, index, self, count);
});

// NodeList(2), <div></div>, 0, NodeList(2), 0
// NodeList(2), <div></div>, 1, NodeList(2), 1

```
Foreach also works on strings:
```javascript

foreach('ABC', function(v,i,s) {
  console.log(v,i,s);
});

// A, 0, ABC
// B, 1, ABC
// C, 2, ABC
```
`true` is a special case. Give the set `true`, and your function will run, but only once. If your set is falsy, `foreach` will not run at all.
```javascript
foreach(true, function(v,i) { console.log(v, i, this,+this) }); // undefined, 0, true, 1
foreach(false, function(v,i) { console.log('this ran!') }); // /
```
`Foreach` always returns the set you gave it after your function iterates over it. *For falsy sets, `foreach` returns `undefined`*.
```javascript
var k;

k = foreach('ABC', function(){}); console.log(k); // 'ABC'
k = foreach(400, function(){}); console.log(k); // 400
k = foreach([1,2,3], function(i){}); console.log(k); // [1,2,3]
k = foreach([6,5,4], function(v,i) { this[i] = 0; }); console.log(k); // [0,0,0]
k = foreach(true, function(v,i){}); console.log(k); // true

console.log(foreach(false), foreach(0), foreach(NaN), foreach(null), foreach(''), foreach(undefined)); // all `undefined`
```

#### this

The `this` scope of your function. Except for `String` sets, the `this` scope is always set as your set. For strings, `this` is set to an array form of said string.

#### value

The current value in your set that you're iterating over. For number iterations, `value` is always the same as `index`.

#### index

The index that you're currently at in your set. `foreach` allows you to jump to a specific index by returning certain values from your callback function.

#### self

Your set.

#### count / iterations

The number of times that your callback function has executed. Unlike index, this value cannot be modified. 
Useful if you're jumping back and forth between indexes, but want to make sure that your function only runs a specific number of times.

-----

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

#### Jumping to specific indexes:

...


Dynamic Iteration:
-----
Sometimes you want to iterate over your set while conditionally modifying the set itself. By default, your set's `.length` is created / stored on initialization so as not to create infinite loops, but you can set `dynamiclength` to `true` to continually check your set's `.length` as you go. But be careful, your loop can run indefinitely if you never return `false` within your callback, or if `foreach.maxIterations` is not set as a failsafe. Dynamic iteration has no effect on `Number` sets, as `.length` will be initialized to the number given.

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

### Change Log:

  *// custom release history
  
  *// 1.2.1 added support for strings
  
  *// 1.2.2 added support for numbers
  
// 1.2.3 changed `set[i]` to `(num ? i : set[i])`, making numeric iteration ~6x faster

// 1.2.4 added `.maxIterations` for debugging / quick testing

// 1.2.4.5 changed set to be `self`

// 1.2.4.7 allowed `foreach` to specify returning default `undefined` instead of the original set post-iteration

// 1.2.4.8 added support for returning custom values out of the function itself (true, false, null, and any custom string by using `return '@value'`;

// 1.2.4.9 returning `true` is modified to skip over the next value in the set.

// 1.2.5 allow reverse iteration of arrays
