foreach.version = "1.2.3";

function foreach(array, callback, dynamiclength, callscope) { 

	if (!array) { return } // Return `undefined` if falsy. It's not necessarily an array, but just needs to be iterable in some form. 
	// At present, `undefined`, `false`, `0`, `null`, and `''` are not iterable.
	if (typeof callback !== 'function') { throw new TypeError(callback + ' is not a function!'); }
	
	var i=0;
	var len = (array === true) ? 1 : array.length || 0; // iterator
	var str, value, scope, x, num;

	if (typeof array === 'number') { dynamiclength = false; len = array; num = true } else
	if (typeof array === 'string') { array = array.split(''); str = true; } // add unicode values
	if (typeof dynamiclength === 'object') {  } // isArrayLike

	scope = (callscope === x) ? array : callscope;
	
	// MDN forEach syntax: arr.forEach(callback(currentValue [, index [, array]])[, thisArg])

	for (; i < (dynamiclength ? array.length : len); i++) {
							
		 value = callback.call(scope, (num ? i : array[i]), i, array); // changing `array[i]` to `(num ? i : array[i])` makes iteration ~6x faster for numbers

		 if (value === false) {break} else
		 if (value === true) {continue} else
		 if (typeof value === 'number') {
			 i+= value;
		 } else
		 if (typeof value === 'object') {	
		 } else
		 if (typeof value === 'string') {
			 // return "wait 1000"
		 }

	}
	return (str) ? array.join('') : array;
}
