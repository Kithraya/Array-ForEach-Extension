# foreach
Helper function `foreach` with massively extended functionality.

### Syntax: 
```javascript
foreach( MULTI array or iterable value, FUNCTION callback(value [, index, [, self [, iterations]]]){} , BOOLEAN use_dynamic_length, MULTI modify_this_scope);

as in: foreach(array, callback([value [, index [, self [, iterations]]]]), [dynamiclength], [thisArg]);
```

```javascript
// example

foreach(['X','Y','Z'], function(value, index, self, iterations) { 
   console.log(value, index, self, iterations, this);
});

// 'X', 0, ['X','Y','Z'], 0, ['X','Y','Z']
// 'Y', 1, ['X','Y','Z'], 1, ['X','Y','Z']
// 'Z', 2, ['X','Y','Z'], 2, ['x','Y','Z']


// assuming there are only 2 'div's on the page:
foreach ( document.querySelectorAll('div'), function(value,index,self,count) {
   console.log(value, index, self, count, this);
});

// <div></div>, 0, NodeList(2), 0, NodeList(2)
// <div></div>, 1, NodeList(2), 1, NodeList(2)
```
Note that the callback parameters are optional.
```javascript
foreach([1,2,3], function() {
   console.log(this); // [1,2,3], [1,2,3], [1,2,3]
});
```
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
You can return other values besides `false`, but we'll get to that later. 

Sometimes you want to iterate over an array while conditionally modifying the array itself. By default, the array length is stored on initialization so as not to create infinite loops, but you can set `dynamiclength` to `true` to continually check the `array.length` as you go. But be careful, your loop will run indefinitely if you never return `false` within your callback, or if `foreach.maxIterations` is not set.

```javascript
// example with stored length. This is the default functionality.
var k = foreach([1,2,3], function(v,i) {
   this.push( String(i) );
});
console.log(k); // [1,2,3,"0","1","2"]

// example with dynamic length

var k = foreach([1,2,3], function(v,index) {
   this.push( String(index) );
   if (index > 4) { return false } 
}, true);
console.log(k); // [1,2,3,"0","1","2","3","4","5"]
```

##### foreach() also loops through numbers and strings:

```javascript

foreach ( 40 , function(value, index, self, count) { console.log(value,index,self,count,this); });

// 0, 0, 40, 0, 40
// 1, 1, 40, 1, 40
// 2, 2, 40, 2, 40
// ...
// 38, 38, 40, 38, 40
// 39, 39, 40, 39, 40

```
For numbers, `value` is always the same as `index`. 

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


### Foreach also iterates over strings.

As strings are immutable, `foreach` internally converts any string to an array of characters via `String.split('')`, and sets the `this` scope as the internal string-array. This allows for easy modification.

```javascript
var str = foreach('ABCDE', function(v,i,s) {
   console.log(v,i,s); 
   if (!i) { console.log(this) } // ["A","B","C","D","E"]
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
Once `foreach` is done iterating over the string-array, it internally `joins` the array back into a string and returns that string.

At the moment, do not use `foreach` for strings having surrogate pairs, as foreach splits / joins by `''` which defaults to UTF-16 codeunits.
