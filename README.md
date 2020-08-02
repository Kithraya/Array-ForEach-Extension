# `foreach
Helper function foreach with extended functionality.
Next version adds support for arraylike objects

Syntax: `foreach( MULTI [array or iterable value], FUNCTION [ callback( value, index, array, iterations ) {} ], BOOLEAN [useDynamicLength], MULTI [modify_scope] );`


If not set, `use_DYNAMIC_length` defaults to `false`;
If not set, `modify_scope` defaults to the initial array passed.
`this` is the array itself

You can break out of `foreach` early by returning certain values within the callback function:

`//for (var i=0;i<6;i++) {`

    return false => break;
    return true => continue;
    return 4 => i+=4;
    return -4 => i-=4;

`//}`

Example:

`var x = 0, s = ['a','b','c']`;

`var k = foreach(s, function ( value, index ) {
    this.push( x++ );
});`

`console.log( k ); // [ '0', '1', '2', 'a0', 'b1', 'c2' ]`
