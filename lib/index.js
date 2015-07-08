'use strict';

// MODULES //

var isNumber = require( 'validate.io-number-primitive' ),
	isnan = require( 'validate.io-nan' ),
	isArrayLike = require( 'validate.io-array-like' ),
	isTypedArrayLike = require( 'validate.io-typed-array-like' ),
	isMatrixLike = require( 'validate.io-matrix-like' ),
	ctors = require( 'compute-array-constructors' ),
	matrix = require( 'dstructs-matrix' ),
	validate = require( './validate.js' );


// FUNCTIONS //

var gammaincinv1 = require( './array.js' ),
	gammaincinv2 = require( './accessor.js' ),
	gammaincinv3 = require( './deepset.js' ),
	gammaincinv4 = require( './matrix.js' ),
	gammaincinv5 = require( './typedarray.js' ),
	gammaincinv6 = require( './number.js' );


/**
* FUNCTION: fill( n, val )
*	Creates an array of length n and fills it with the supplied value
* @param {Number} n - array length
* @param {*} val - value to fill the array with
* @returns {Array} array of length n
*/
function fill( n, val ) {
	var ret = new Array( n );
	for ( var i = 0; i < n; i++ ) {
		ret[ i ] = val;
	}
	return ret;
}


// INVERSE INCOMPlETE GAMMA FUNCTION //

/**
* FUNCTION: gammaincinv( x, y[, opts] )
*	Computes the inverse incomplete gamma function.
*
* @param {Number|Number[]|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Matrix} x - input value
* @param {Number|Number[]|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Matrix} y - either an array or matrix of equal dimension or a scalar
* @param {Object} [opts] - function options
* @param {Boolean} [opts.copy=true] - boolean indicating if the function should return a new data structure
* @param {Function} [opts.accessor] - accessor function for accessing array values
* @param {String} [opts.path] - deep get/set key path
* @param {String} [opts.sep="."] - deep get/set key path separator
* @param {String} [opts.dtype="float64"] - output data type
* @param {String} [opts.tail="lower"] - string indicating whether to invert the lower or upper incomplete gamma function
* @returns {Number|Number[]|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Matrix} function value(s)
*/
function gammaincinv( x, y, options ) {
	/* jshint newcap:false */
	var opts = {},
		ctor,
		err,
		out,
		dt,
		d,
		scalarCase = false;
	// Handle cases where first argument is a number
	if ( isNumber( x ) || isnan( x ) ) {
		for ( var key in options ) {
			if ( key !== 'dtype' && key !== 'tail' ){
				throw new Error( 'gammaincinv()::only dtype and tail options are applicable when first argument is not array- or matrix-like. Keys: `' + Object.keys( options ) + '`.' );
			}
		}
		if ( isMatrixLike( y ) ) {
			// Create a matrix holding x's:
			d = new Float64Array( fill( y.length, x ) );
			x = matrix( d, y.shape, 'float64' );
			return options ? gammaincinv( x, y, options ) : gammaincinv( x, y );
		}
		if ( isArrayLike( y ) ) {
			return options ? gammaincinv( fill( y.length, x ), y, options ) : gammaincinv( fill( y.length, x ), y );
		}
		if ( !isNumber( y ) ) {
			return NaN;
		}
		scalarCase = true;
	}
	if ( arguments.length > 2 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	opts.tail = opts.tail || 'lower';
	if ( opts.tail !== 'lower' && opts.tail !== 'upper' ){
		throw new Error( 'gammaincinv()::invalid option. Tail option has to be either `lower` or `upper`. Value: ' + opts.tail + '`.' );
	}

	if ( scalarCase === true ) {
		return (opts.tail === 'upper') ? gammaincinv6.upper( x, y ) : gammaincinv6.lower( x, y );
	}
	if ( isMatrixLike( x ) ) {
		if ( opts.copy !== false ) {
			dt = opts.dtype || 'float64';
			ctor = ctors( dt );
			if ( ctor === null ) {
				throw new Error( 'gammaincinv()::invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
			}
			// Create an output matrix:
			d = new ctor( x.length );
			out = matrix( d, x.shape, dt );
		} else {
			out = x;
		}
		return gammaincinv4( out, x, y, opts.tail );
	}
	if ( isTypedArrayLike( x ) ) {
		if ( opts.copy === false ) {
			out = x;
		} else {
			dt = opts.dtype || 'float64';
			ctor = ctors( dt );
			if ( ctor === null ) {
				throw new Error( 'gammaincinv()::invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
			}
			out = new ctor( x.length );
		}
		return gammaincinv5( out, x, y, opts.tail );
	}
	if ( isArrayLike( x ) ) {
		// Handle deepset first...
		if ( opts.path ) {
			opts.sep = opts.sep || '.';
			return gammaincinv3( x, y, opts.path, opts.sep, opts.tail );
		}
		// Handle regular and accessor arrays next...
		if ( opts.copy === false ) {
			out = x;
		}
		else if ( opts.dtype ) {
			ctor = ctors( opts.dtype );
			if ( ctor === null ) {
				throw new TypeError( 'gammaincinv()::invalid input argument. Unrecognized/unsupported array-like object. Provide either a plain or typed array. Value: `' + x + '`.' );
			}
			out = new ctor( x.length );
		}
		else {
			out = new Array( x.length );
		}
		if ( opts.accessor ) {
			return gammaincinv2( out, x, y, opts.accessor, opts.tail );
		}
		return gammaincinv1( out, x, y, opts.tail );
	}
	return NaN;
} // end FUNCTION gammaincinv()


// EXPORTS //

module.exports = gammaincinv;
