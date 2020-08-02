# `foreach(value, callback(currentValue [, index [, array [, iterations]]])[, dynamiclength][, thisArg])`
Helper function foreach with extended functionality.
Next version adds support for strings and arraylike objects

Syntax: `foreach( ARRAY [...], FUNCTION callback( value, index ) {...}, BOOLEAN use_DYNAMIC_length, OBJECT modify_scope);`


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
