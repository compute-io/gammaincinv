'use strict';

// MODULES //

var isMatrixLike = require( 'validate.io-matrix-like' );


// FUNCTIONS

var GAMMAINCINV = require( './number.js' );


// INVERSE INCOMPlETE GAMMA FUNCTION //

/**
* FUNCTION: gammaincinv( out, x, y[, tail] )
*	Computes the inverse incomplete gamma function for each matrix element
*
* @param {Matrix} out - output matirx
* @param {Matrix} x - input matrix
* @param {Matrix|Number} y - either a matrix of equal dimensions or a scalar
* @param {String} [tail="lower"] - wheter to compute the lower or upper incomplete gamma function
* @returns {Matrix} output matrix
*/
function gammaincinv( out, x, y, tail ) {
	var len = x.length,
		i, j,
		M, N,
		FUN;

	if ( out.length !== len ) {
		throw new Error( 'gammaincinv()::invalid input arguments. Input and output matrices must be the same length.' );
	}

	if ( tail === 'upper' ) {
		FUN = GAMMAINCINV.upper;
	} else {
		FUN = GAMMAINCINV.lower;
	}

	if ( isMatrixLike( y ) ) {
		M = x.shape[0];
		N = x.shape[1];
		if ( M !== x.shape[0] || N !== y.shape[1] ) {
			throw new Error( 'gammaincinv()::invalid input arguments. Scale matrix must have the same number of rows and columns as the input matrix.' );
		}
		for ( i = 0; i < M; i++ ) {
			for ( j = 0; j < N; j++ ) {
				out.set( i, j, FUN( x.get( i, j ), y.get( i, j ) ) );
			}
		}
	} else {
		for ( i = 0; i < len; i++ ) {
			out.data[ i ] = FUN( x.data[ i ], y );
		}
	}
	return out;
} // end FUNCTION gammaincinv()


// EXPORTS //

module.exports = gammaincinv;