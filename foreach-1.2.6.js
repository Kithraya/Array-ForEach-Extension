foreach.version = "1.2.6";
foreach.maxIterations = null;
foreach.Worker = null;

function foreach(set, callback, options, callscope) { // go inverse on negative numbers?

	if (!set) { return } // Return `undefined` (`null`?) if falsy. At present, falsy values do not make sense being iterable
	if (typeof callback !== 'function') { throw new TypeError(callback + ' is not a function!') }

	var limit = foreach.maxIterations || Infinity;
	var len = (typeof set.length === 'number') ? set.length : (typeof set === 'number') ? set : 1; // +!!truthyVar => 1
	var i=0, c=0, inc=1, left_cond = len, right_cond = Infinity; // index, count, increment

	/* If set has a numeric .length property, return the .length;
	   If set doesnt have a .length, assume it's a number.
	   If not a number and no length, coerce to binary. (+!!val);
	*/
	var retfalsy = !!options, dynamiclength = !!options;
	var str, num, inverse, v, u;
	var nullscope = true; // scopeless (null scope) is a significant performance increase (50%-65% over test());
	var self = set;
	
	if (typeof set === 'number') { dynamiclength = !(num = true); } else // >:)
	if (typeof set === 'string') { str = set = set.split(''); } // TODO: add full Unicode support (splitting by '' destroys surrogate pairs);

	if (options === -1) { dynamiclength = false; retfalsy = true; inverse = true; }

	callscope = (nullscope) ? null : (arguments.length === 4) ? callscope : set;
// ( ͡⚆ ͜ʖ ͡⚆)╭∩╮
	if (inverse) {
		i = len - 1;
		inc = -1;
		left_cond = -Infinity;
		right_cond = 0;
	}
	/*(OR) Logic Gate Table:
		[FOREACH v1.2.5)]: The `for (; test(); i+=inc) {}` approach was ~12+% slower due to repeatedly calling test() at each iteration step

		Condition: ( LEFTSIDE || RIGHTSIDE )

		Forwards:	[ (0 < len) || (0 >= Infinity) ]
		Backwards:	[ (len-1 < -Infinity) || (len-1 >= 0) ]

		len = 0, Backwards: -1 < -Infinity || -1 >= 0;
	*/
	  for (; i < (dynamiclength ? set.length : left_cond) || i >= right_cond; i+=inc) {

			if (c >= limit) { try { console.warn('Limit reached!') } catch (e) {} break} // can't assume console.polyfill is used; prevent IE throwing errors on console object until devTools is opened.

			v = callback.call( callscope, (num ? i: set[i]), i, self, c );

			if (v !== undefined) {
				if (v === false) { break } else
				if (v === true) {
					i+=inc; // skip over next element / iteration in the set (since this isnt a traditional loop, by the time we get here the callback is already executed)
					continue;
				} else
				if (typeof v === 'number') { if (v !== v) { throw new TypeError("NaN can't be iterated over"); } // exclude NaN
					i+=v;
				} else
				if (typeof v === 'object') {
					 // for when null is returned or an object literal (TODO)
				} else
				if (typeof v === 'string') {
					if (v.charAt(0) === '@') {
						v = v.substring(1);
						if (v === 'true') {return true} if (v === 'false') {return false}
						if (v === 'null') {return null} if (v === 'undefined') {return}
						return v;
					} else {
						i = Number(v);
					}
				}
			c++;
		  }
	  }
	return (!retfalsy) ? u : (!!str) ? set.join('') : set;
}
