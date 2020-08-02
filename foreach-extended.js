foreach.version = "1.2.4";
foreach.maxIterations = Infinity;

function foreach(array, callback, dynamiclength, callscope) { 

	if (!array) { return } // Return `undefined` if falsy. It's not necessarily an array, but it does need to be iterable in some form. 
	// At present, `undefined`, `false`, `0`, `null`, `NaN`, and `''` do not make sense being iterable values.
	if (typeof callback !== 'function') { throw new TypeError(callback + ' is not a function!'); }
	
	var i=0,j=0;
	var len = (array === true) ? 1 : array.length || 0; // iterator
	var str, value, scope, x, num;
	var limit = foreach.maxIterations || Infinity;

	if (typeof array === 'number') { dynamiclength = false; len = array; num = true } else
	if (typeof array === 'string') { array = array.split(''); str = true; } // add unicode values
	if (typeof dynamiclength === 'object') {  } // isArrayLike

	scope = (callscope === x) ? array : callscope;
	
	// MDN forEach syntax: arr.forEach(callback(currentValue [, index [, array]])[, thisArg])
	// Ours: foreach(value, callback(currentValue [, index [, array [, iterations]]])[, dynamiclength][, thisArg])
	
	for (; i < (dynamiclength ? array.length : len); i++) {
		 /// if (j >= limit) { console.warn('Limit reached!'); break}
		 value = callback.call(scope, (num ? i : array[i]), i, array, j); // changing `array[i]` to `(num ? i : array[i])` strangely makes iteration ~6x faster for numbers

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
		 j++;

	}
	return (str) ? array.join('') : array;
}
