'use strict';

// MODULES //

var isArrayLike = require( 'validate.io-array-like' ),
	isTypedArrayLike = require( 'validate.io-typed-array-like' );


// FUNCTIONS

var GAMMAINCINV = require( './number.js' );


// INVERSE INCOMPlETE GAMMA FUNCTION //

/**
* FUNCTION: gammaincinv( out, arr, a[, tail] )
*	Computes the inverse incomplete gamma function for a typed array.
*
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} out - output array
* @param {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} arr - input array
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Number} a - either an array of equal length or a scalar
* @param {String} [tail="lower"] - wheter to compute the lower or upper incomplete gamma function
* @returns {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} output array
*/
function gammaincinv( out, arr, a, tail ) {
	var len = arr.length,
		i,
		FUN;

	if ( tail === 'upper' ) {
		FUN = GAMMAINCINV.upper;
	} else {
		FUN = GAMMAINCINV.lower;
	}

	if ( isTypedArrayLike( a ) ) {
		if ( len !== a.length ) {
			throw new Error( 'gammaincinv()::invalid input argument. Scale array must have a length equal to that of the input array.' );
		}
		for ( i = 0; i < len; i++ ) {
				out[ i ] = FUN( arr[ i ], a[ i ] );
		}
	} else if ( isArrayLike( a ) ) {
		if ( len !== a.length ) {
			throw new Error( 'gammaincinv()::invalid input argument. Scale array must have a length equal to that of the input array.' );
		}
		for ( i = 0; i < len; i++ ) {
			if ( typeof a[ i ] === 'number' ) {
				out[ i ] = FUN( arr[ i ], a[ i ] );
			} else {
				out[ i ] = NaN;
			}
		}
	} else {
		if (  typeof a === 'number' ) {
			for ( i = 0; i < len; i++ ) {
				out[ i ] = FUN( arr[ i ], a );
			}
		} else {
			for ( i = 0; i < len; i++ ) {
				out[ i ] = NaN;
			}
		}
	}
	return out;
} // end FUNCTION gammaincinv()


// EXPORTS //

module.exports = gammaincinv;
