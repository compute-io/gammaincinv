'use strict';

// MODULES //

var isArrayLike = require( 'validate.io-array-like' ),
	isTypedArrayLike = require( 'validate.io-typed-array-like' ),
	isObject = require( 'validate.io-object' );


// FUNCTIONS

var GAMMAINCINV = require( './number.js' );


// INVERSE INCOMPlETE GAMMA FUNCTION //

/**
* FUNCTION: gammaincinv( out, arr, a, clbk[, tail] )
*	Computes the inverse incomplete gamma function for an array using an accessor.
*
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} out - output array
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} arr - input array
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Number} a - either an array of equal length or a scalar
* @param {Function} accessor - accessor function for accessing array values
* @param {String} [tail="lower"] - whether to compute the lower or upper incomplete gamma function
* @returns {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} output array
*/
function gammaincinv( out, arr, a, clbk, tail ) {
	var len = arr.length,
		i,
		arrVal, aVal,
		FUN;

	if ( tail === 'upper' ) {
		FUN = GAMMAINCINV.upper;
	} else {
		FUN = GAMMAINCINV.lower;
	}

	if ( isTypedArrayLike( a ) ) {
		if ( len !== a.length ) {
			throw new Error( 'gammaincinv()::invalid input argument. Exponent array must have a length equal to that of the base array.' );
		}
		for ( i = 0; i < len; i++ ) {
			arrVal = clbk( arr[ i ], i, 0 );
			if ( typeof arrVal === 'number' ) {
				out[ i ] = FUN( arrVal, a[ i ] );
			} else {
				out[ i ] = NaN;
			}
		}
	} else if ( isArrayLike( a ) ) {
		if ( len !== a.length ) {
			throw new Error( 'gammaincinv()::invalid input argument. Exponent array must have a length equal to that of the base array.' );
		}
		if ( !isObject( a[ 0 ] ) ) {
			// Guess that `a` is a primitive array -> callback does not have to be applied
			for ( i = 0; i < len; i++ ) {
				arrVal = clbk( arr[ i ], i, 0 );
				if ( typeof a[ i ] === 'number' && typeof arrVal === 'number' ) {
					out[ i ] = FUN( arrVal,  a[ i ] );
				} else {
					out[ i ] = NaN;
				}
			}
		} else {
			// `a` is an object array, too -> callback is applied
			for ( i = 0; i < len; i++ ) {
				arrVal = clbk( arr[ i ], i, 0 );
				aVal = clbk( a[ i ], i, 1 );
				if ( typeof arrVal === 'number' && typeof aVal  === 'number' ) {
					out[ i ] = FUN( arrVal, aVal );
				} else {
					out[ i ] = NaN;
				}
			}
		}
	} else {
		if ( typeof a === 'number' ) {
			for ( i = 0; i < len; i++ ) {
				arrVal = clbk( arr[ i ], i );
				if ( typeof arrVal === 'number' ) {
					out[ i ] = FUN( arrVal, a );
				} else {
					out[ i ] = NaN;
				}
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
