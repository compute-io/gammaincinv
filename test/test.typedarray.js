/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to check whether a value is NaN
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	gammaincinv = require( './../lib/typedarray.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'typed-array gammaincinv', function tests() {

	it( 'should export a function', function test() {
		expect( gammaincinv ).to.be.a( 'function' );
	});

	it( 'should calculate the inverse __lower__ incomplete gamma function for two typed arrays', function test() {
		var data, actual, expected, y, i;

		data = new Float64Array([
			0.1,
			0.2,
			0.3,
			0.4,
			0.5
		]);
		y = new Float64Array([
			0.1,
			0.2,
			0.3,
			0.4,
			0.5
		]);
		actual = new Float64Array( data.length );

		actual = gammaincinv( actual, data, y );

		expected = new Float64Array([
			0,
			0.000208852,
			0.0127267,
			0.0793619,
			0.227468
		]);

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}
	});


	it( 'should calculate the inverse __upper__ incomplete gamma function for two typed arrays', function test() {
		var data, actual, expected, y, i;

		data = new Float64Array([
			0.1,
			0.2,
			0.3,
			0.4,
			0.5
		]);
		y = new Float64Array([
			0.1,
			0.2,
			0.3,
			0.4,
			0.5
		]);
		actual = new Float64Array( data.length );

		actual = gammaincinv( actual, data, y, 'upper' );

		expected = new Float64Array([
			0.266155,
			0.263544,
			0.256565,
			0.244752,
			0.227468
		]);

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}
	});

	it( 'should throw an error if provided two typed arrays of differing lengths', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			gammaincinv( new Array(2), new Int8Array( [1,2] ), new Int8Array( [1,2,3] ) );
		}

		expect( foo2 ).to.throw( Error );
		function foo2() {
			gammaincinv( new Array(2), new Int8Array( [1,2] ), [ 1, 2, 3 ] );
		}
	});

	it( 'should handle non-numeric `a` values by setting the respective element to NaN', function test() {
		var data, actual, expected, y, i;

		data = new Float64Array([
			0.1,
			0.2,
			0.3,
			0.4
		]);
		actual = new Array( data.length );
		actual = gammaincinv( actual, data, null );

		expected = [ NaN, NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );

		actual = new Array( data.length );
		y = [ 0.1, 0.2, 0.3, null ];
		actual = gammaincinv( actual, data, y );

		expected = [
			6.07305e-11,
			0.000208852,
			0.0127267,
			NaN
		];

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isnan( expected[ i ] ) && !isnan( actual[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4);
			}
		}

	});

	it( 'should return an empty array if provided an empty array', function test() {
		assert.deepEqual( gammaincinv( new Int8Array(), new Int8Array() ), new Int8Array() );
	});

});
