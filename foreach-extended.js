// MDN forEach syntax: arr.forEach(callback(currentValue [, index [, set]])[, thisArg])
// Ours: foreach(set, callback(currentValue [, index [, set [, iterations]]])[, dynamiclength][, thisArg])
foreach.version = "1.2.5";
foreach.maxIterations = Infinity;
foreach.reverse = null; foreach.iterate = null; // TODO

function foreach(set, callback, options, callscope) {

	if (!set) { return } // Return `undefined` (`null`?) if falsy. At present, falsy values do not make sense being iterable
	if (typeof callback !== 'function') { throw new TypeError(callback + ' is not a function!') }

	var i=0, c=0, inc=1; // index, count, increment

	var len = (typeof set.length === 'number') ? set.length : (typeof set === 'number') ? set : 1; // Number(!!truthyVar) is always 1

	/* If set has a numeric .length property, return the .length;
	   If set doesnt have a .length, assume it's a number.
	   If not a number and no length, coerce to binary.
	*/
	var str, value, scope, num, u, test;
	var limit = foreach.maxIterations || Infinity;
	var self = set;
	var retfalsy = !!options, dynamiclength = !!options;
	var inverse = (options === -1) ? !0 : !1;

	if (typeof set === 'number') { dynamiclength = !(num = true) } else // >:)
	if (typeof set === 'string') { str = set = set.split(''); } // TODO: add full Unicode support (splitting by '' destroys surrogate pairs);

	if (options === -1) { dynamiclength = false; retfalsy = true; }

	scope = (arguments.length === 4) ? callscope : set;

	if (inverse) {
		i = len - 1;
		inc = -1;
		test = function() { return i >= 0 };
	} else {
		i = 0;
		inc = 1;
		test = function() { return i < (dynamiclength ? set.length : len) };
	}

	for (; test(); i+=inc) {

		 if (c >= limit) { try { console.warn('Limit reached!'); } catch (e) {} break} // can't assume console.polyfill is used; prevent IE throwing errors on console object until devTools is opened.

		 value = callback.call(scope, (num ? i : set[i]), i, self, c); // changing `set[i]` to `(num ? i : set[i])` strangely makes iteration ~6x faster for numbers

		 if (value === false) {break} else
		 if (value === true) {
			 i+=inc; // skip over next element / iteration in the set (since this isnt a traditional loop, by the time we get here the callback is already executed)
			 continue;
		 } else
		 if (typeof value === 'number') { if (value !== value) { throw new TypeError("NaN can't be iterated over"); } // exclude NaN
			 i+= value;
		 } else
		 if (typeof value === 'object') {
			  // for when null is returned or an object literal (TODO)
		 } else
		 if (typeof value === 'string') {
			if (value.charAt(0) === '@') {
				value = value.substring(1);
				if (value === 'true') {return true} if (value === 'false') {return false}
				if (value === 'null') {return null} if (value === 'undefined') {return}
				return value;
				// TODO: add full Unicode support for strings
				// TODO: add custom increment values;
			} else {
				i = Number(value);
			}
		 }
		 c++;
	}

	return (!retfalsy) ? u : (!!str) ? set.join('') : set;
}
