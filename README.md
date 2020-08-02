# foreach
Helper function foreach with extended functionality.
Next version adds support for arraylike objects

Syntax: `foreach( MULTI [array or iterable value], FUNCTION [ callback( value, index, array, iterations ) {} ], BOOLEAN [useDynamicLength], MULTI [modify_scope] );`

```javascript
foreach(value, callback(currentValue [, index [, array [, iterations]]])[, dynamiclength][, thisArg])


```
