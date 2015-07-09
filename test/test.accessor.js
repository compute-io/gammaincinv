/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to check whether a value is NaN
	isnan = require( 'validate.io-nan' ),

	// Module to check whether values are infinite
	isinf = require( 'compute-isinf' ),

	// Module to be tested:
	gammaincinv = require( './../lib/accessor.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'accessor gammaincinv', function tests() {

	it( 'should export a function', function test() {
		expect( gammaincinv ).to.be.a( 'function' );
	});

	it( 'should evaluate the inverse of the __lower__ gamma function of an array with a scalar using an accessor', function test() {
		var data, actual, expected, i;

		data = [
			{'x':0},
			{'x':0.1},
			{'x':0.2},
			{'x':0.3},
			{'x':0.4},
			{'x':0.5},
			{'x':0.6},
			{'x':0.7},
			{'x':0.8},
			{'x':0.9},
			{'x':1}
		];
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, 1, getValue );

		// Evaluated on Wolfram Mathematica
		expected = [
			0,
			0.105361,
			0.223144,
			0.356675,
			0.510826,
			0.693147,
			0.916291,
			1.20397,
			1.60944,
			2.30259,
			Number.POSITIVE_INFINITY
		];

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isinf( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4 );
			}
		}

		function getValue( d ) {
			return d.x;
		}

	});

	it( 'should evaluate the inverse of the __upper__ gamma function of an array with a scalar using an accessor', function test() {
		var data, actual, expected, i;

		data = [
			{'x':0},
			{'x':0.1},
			{'x':0.2},
			{'x':0.3},
			{'x':0.4},
			{'x':0.5},
			{'x':0.6},
			{'x':0.7},
			{'x':0.8},
			{'x':0.9},
			{'x':1}
		];
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, 1, getValue, 'upper' );

		// Evaluated on Wolfram Mathematica
		expected = [
			Number.POSITIVE_INFINITY,
			2.30259,
			1.60944,
			1.20397,
			0.916291,
			0.693147,
			0.510826,
			0.356675,
			0.223144,
			0.105361,
			0
		];

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isinf( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4 );
			}
		}

		function getValue( d ) {
			return d.x;
		}

	});

	it( 'should evaluate the inverse incomplete gamma function for two arrays using an accessor', function test() {
		var data, actual, expected, y, i;

		data = [
			{'x':0.1},
			{'x':0.2},
			{'x':0.3},
			{'x':0.4},
			{'x':0.5}
		];

		y = [
			0.1,
			0.2,
			0.3,
			0.4,
			0.5
		];

		actual = new Array( data.length );
		actual = gammaincinv( actual, data, y, getValue );

		// Evaluated on Wolfram Mathematica
		expected = [
			0,
			0.000208852,
			0.0127267,
			0.0793619,
			0.227468
		];

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}

		function getValue( d, i ) {
			return d.x;
		}

	});

	it( 'should evaluate the inverse incomplete gamma function for two object arrays using an accessor', function test() {
		var data, actual, expected, y, i;

		data = [
			{'x':0.1},
			{'x':0.2},
			{'x':0.3},
			{'x':0.4},
			{'x':0.5}
		];

		y = [
			{'y':0.1},
			{'y':0.2},
			{'y':0.3},
			{'y':0.4},
			{'y':0.5}
		];

		actual = new Array( data.length );
		actual = gammaincinv( actual, data, y, getValue );

		// Evaluated on Wolfram Mathematica
		expected = [
			0,
			0.000208852,
			0.0127267,
			0.0793619,
			0.227468
		];

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}

		function getValue( d, i, j ) {
			if ( j === 0 ) {
				return d.x;
			} else {
				return d.y;
			}
		}

	});

	it( 'should return empty array if provided an empty array', function test() {
		assert.deepEqual( gammaincinv( [], [], 1, getValue ), [] );
		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should handle non-numeric values by setting the element to NaN', function test() {
		var data, actual, expected, y, i;

		// numeric value
		data = [
			{'x':0.1},
			{'x':null},
			{'x':0.3}
		];
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, 1, getValue );

		expected = [ 0.105361, NaN, 0.356675 ];
		for ( i = 0; i < expected.length; i++ ) {
			if ( !isnan( expected[ i ] ) && !isnan( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4);
			}
		}

		// single non-numeric value
		y = false;
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, y, getValue );
		expected = [ NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );

		// numeric array
		y = [ 1, 2, 3 ];
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, y, getValue );
		expected = [ 0.105361, NaN,  1.91378 ];


		for ( i = 0; i < expected.length; i++ ) {
			if ( !isnan( expected[ i ] ) && !isnan( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4);
			}
		}

		function getValue( d, i ) {
			return d.x;
		}

		// typed array
		y = new Int32Array( [1,2,3] );
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, y, getValue );
		expected = [ 0.105361, NaN,  1.91378 ];

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isnan( expected[ i ] ) && !isnan( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4);
			}
		}

		// object array
		y = [
			{'y':1},
			{'y':2},
			{'y':3}
		];
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, y, getValue2 );
		expected = [ 0.105361, NaN,  1.91378 ];

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isnan( expected[ i ] ) && !isnan( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4);
			}
		}

		function getValue2( d, i, j ) {
			if ( j === 0 ) {
				return d.x;
			} else {
				return d.y;
			}
		}

	});

	it( 'should throw an error if provided an array of exponents which is not of equal length to the base array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			gammaincinv( [], [1,2], [1,2,3], getValue );
		}
		function getValue( d ) {
			return d;
		}
	});

	it( 'should throw an error if provided a typed array of exponents which is not of equal length to the base array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			gammaincinv( [], [1,2], new Int32Array( [1,2,3] ), getValue );
		}
		function getValue( d ) {
			return d;
		}
	});

});
