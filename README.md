# foreach
Helper function foreach with extended functionality.
Next version adds support for arraylike objects

### Syntax: 
```javascript
foreach( MULTI {array or iterable value}, FUNCTION {callback(value [, index, [, self [, iterations]]]){} }, BOOLEAN {use_dynamic_length}, MULTI {modify_this_scope});
```

```javascript
foreach(array, callback(value [, index [, self [, iterations]]])[, dynamiclength][, thisArg]);

// example

foreach(['Z','Y','X','W'], function(value, index, self, iterations) {
  
  console.log(value, index, self, iterations); 
  
  /* 'Z', 0, ['Z','Y','X','W'], 0
     'Y', 1, ['Z','Y','X','W'], 1
     'X', 2, ['Z','Y','X','W'], 2
     'W', 3, ['Z','Y','X','W'], 3
  */
  
  console.log(this); // ['Z','Y','X','W']

});

// assuming there are only 2 'div's on the page:
foreach ( document.querySelectorAll('div'), function(value,index,self,count) {
		
  console.log(value, index, self, count, this);
      
   /* <div></div>, 0, NodeList(2), 0, NodeList(2)
      <div></div>, 1, NodeList(2), 1, NodeList(2)
   */
    
		
});


```
