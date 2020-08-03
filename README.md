# foreach
Helper function `foreach` with extended functionality.
Next version adds support for arraylike objects

### Syntax: 
```javascript
foreach( MULTI {array or iterable value}, FUNCTION {callback(value [, index, [, self [, iterations]]]){} }, BOOLEAN {use_dynamic_length}, MULTI {modify_this_scope});
```

```javascript
foreach(array, callback(value [, index [, self [, iterations]]])[, dynamiclength][, thisArg]);

// example

foreach(['Z','Y','X'], function(value, index, self, iterations) {
  
  console.log(value, index, self, iterations); 
  
  // 'Z', 0, ['Z','Y','X'], 0
  // 'Y', 1, ['Z','Y','X'], 1
  // 'X', 2, ['Z','Y','X'], 2
  
  console.log(this); // ['Z','Y','X']

});

// assuming there are only 2 'div's on the page:
foreach ( document.querySelectorAll('div'), function(value,index,self,count) {
		
  console.log(value, index, self, count, this);
      
   /* <div></div>, 0, NodeList(2), 0, NodeList(2)
      <div></div>, 1, NodeList(2), 1, NodeList(2)
   */
    
		
});


```

##### foreach() also loops through numbers and strings:

```javascript

foreach ( 40, function(value, index, self, count) { console.log(value,index,self,count); });

// 0, 0, 40, 0 
// 1, 1, 40, 1 
// 2, 2, 40, 2
// ...
// 38, 38, 40, 38
// 39, 39, 40, 39

```
For numbers, `value` is the same as `index`. 

You can instantly break out of any `foreach` loop at any time by returning `false` within your callback function. Returning `true` or `undefined` is equivalent to the `continue` statement.

```javascript
foreach ( 40, function ( v, i, s, count ) {
  if (i === 2) { return true }
  if (i === 20) { return false }
  console.log(v, i, s, count);
});

// 0, 0, 40, 0
// 1, 1, 40, 1  
// 3, 3, 40, 2 
// ...
// 19, 19, 40, 18
// 20, 20, 40, 19
```

You may be wondering what the point of 'count' is. You can jump to any point in your `foreach` loop by returning specific values:
