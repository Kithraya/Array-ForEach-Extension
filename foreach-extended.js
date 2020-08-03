foreach.version = "1.2.4.5";
/// foreach.maxIterations = Infinity;
				 
function foreach(set, callback, dynamiclength, callscope) { 

	if (!set) { return } // Return `undefined` if falsy. At present, falsy values do not make sense being iterable.
	if (typeof callback !== 'function') { throw new TypeError(callback + ' is not a function!') }
	
	var i=0,j=0; // index, count
	var len = (set === true) ? 1 : set.length || 0; // .length
	
	var str, value, scope, x, num;
	/// var limit = foreach.maxIterations || Infinity;
	var self = set;

	if (typeof set === 'number') { dynamiclength = !(num = !!(len = set)); } else // >:)
	if (typeof set === 'string') { str = set = set.split(''); } // TODO: add full Unicode support (splitting by '' does not work for surrogate pairs);
 
	scope = (callscope === x) ? set : callscope;
	
	// MDN forEach syntax: arr.forEach(callback(currentValue [, index [, set]])[, thisArg])
	// Ours: foreach(set, callback(currentValue [, index [, set [, iterations]]])[, dynamiclength][, thisArg])
	
	for (; i < (dynamiclength ? set.length : len); i++) {
		 /// if (j >= limit) { console.warn('Limit reached!'); break}
		 value = callback.call(scope, (num ? i : set[i]), i, self, j); // changing `set[i]` to `(num ? i : set[i])` strangely makes iteration ~6x faster for numbers

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
	return (str) ? set.join('') : set;
}
