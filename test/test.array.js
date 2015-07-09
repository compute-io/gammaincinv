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
	gammaincinv = require( './../lib/array.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'array gammaincinv', function tests() {

	it( 'should export a function', function test() {
		expect( gammaincinv).to.be.a( 'function' );
	});

	it( 'should calculate the inverse of the __lower__ incomplete gamma function for an array and a scalar', function test() {
		var data, actual, expected, i;

		data = [
			0,
			0.1,
			0.2,
			0.3,
			0.4,
			0.5,
			0.6,
			0.7,
			0.8,
			0.9,
			1
		];
		actual = new Array( data.length );

		actual = gammaincinv( actual, data, 1 );

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

		// Typed arrays...
		data = new Float32Array( data );
		actual = new Float32Array( data.length );

		actual = gammaincinv( actual, data, 1 );
		expected = new Float32Array( expected );

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isinf( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4);
			}
		}
	});

	it( 'should calculate the inverse of the __upper__ incomplete gamma function for an array and a scalar', function test() {
		var data, actual, expected, i;

		data = [
			0,
			0.1,
			0.2,
			0.3,
			0.4,
			0.5,
			0.6,
			0.7,
			0.8,
			0.9,
			1
		];
		actual = new Array( data.length );

		actual = gammaincinv( actual, data, 1, 'upper' );

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

		// Typed arrays...
		data = new Float32Array( data );
		actual = new Float32Array( data.length );

		actual = gammaincinv( actual, data, 1, 'upper' );
		expected = new Float32Array( expected );

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isinf( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4 );
			}
		}
	});

	it( 'should calculate the inverse incomplete gamma function for two arrays', function test() {
		var data, actual, expected, y, i;

		data = [
			0.1,
			0.2,
			0.3,
			0.4,
			0.5
		];

	 	y = [
			0.1,
			0.2,
			0.3,
			0.4,
			0.5
		];
		actual = new Array( data.length );

		actual = gammaincinv( actual, data, y );

		// Evaluated on Wolfram Mathematica
		expected = [
			0,
			0.000208852,
			0.0127267,
			0.0793619,
			0.227468
		];
		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4 );
		}
		// Typed arrays...
		data = new Int32Array( data );
		actual = new Int32Array( data.length );

		actual = gammaincinv( actual, data, y );
		expected = new Int32Array( expected );

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4 );
		}
	});

	it( 'should return an empty array if provided an empty array', function test() {
		assert.deepEqual( gammaincinv( [], [], 1 ), [] );
		assert.deepEqual( gammaincinv( new Int8Array(), new Int8Array(), 1 ), new Int8Array() );
	});

	it( 'should handle non-numeric values by setting the element to NaN', function test() {
		var data, actual, expected, y, i;

		data = [ true, null, [], {} ];
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, 1 );

		expected = [ NaN, NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );

		actual = new Array( data.length );
		y = [ 1, 2, 3, 4 ];
		actual = gammaincinv( actual, data, y );

		expected = [ NaN, NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );

		data = [ 1, 2, 3 ];
		y = null;
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, y );
		expected = [ NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );

		data = [ 0.1, null, 0.3 ];
		y = new Int32Array( [1,2,3] );
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, y );
		expected = [ 0.105361, NaN,  1.91378 ];

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isnan( expected[ i ] ) && !isnan( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4);
			}
		}

	});

	it( 'should throw an error if provided a scale array which is not of equal length to the input array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			gammaincinv( [], [1,2], [1,2,3] );
		}
		expect( foo2 ).to.throw( Error );
		function foo2() {
			gammaincinv( [], [1,2], new Int32Array( [1,2,3] ) );
		}
	});

});
