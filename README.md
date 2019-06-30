# foreach ( array, function (index, value) {..}, use_DYNAMIC_length, modify_scope )
Helper function foreach with extended functionality.
Next version adds support for strings and arraylike objects

Syntax: foreach( array, function ( index, value ) {..}, use_DYNAMIC_length, set_THIS_scope);


If not set, use_DYNAMIC_length defaults to `false`;

You can break out of the foreach early by returning certain values within the callback function:

return false = "break",
return true = "continue",
return 4 = jump 4,
return -4 = jump -4.

var x = 0;

var k = foreach( [ '0', '1', '2' ], function ( index, value ) {
    this.push( x++ );
});

console.log( k ); // [ '0', '1', '2', 0, 1, 2 ]
