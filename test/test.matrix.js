/* global describe, it, require, beforeEach */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ).raw,

	// Inverse incomplete gamma function
	GAMMAINCINV = require( './../lib/number.js'),

	// Module to be tested:
	gammaincinv = require( './../lib/matrix.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'matrix gammaincinv', function tests() {

	var out1, out2, out3,
		mat,
		d1,
		d2,
		d3,
		d4,
		i;

	d1 = new Float64Array( 25 );
	d2 = new Float64Array( 25 );
	d3 = new Float64Array( 25 );
	d4 = new Float64Array( 25 );
	for ( i = 0; i < d1.length; i++ ) {
		d1[ i ] = i / 25;
		d2[ i ] = GAMMAINCINV.lower( i / 25, i / 25 );
		d3[ i ] = GAMMAINCINV.lower( i / 25, 2 );
		d4[ i ] = GAMMAINCINV.upper( i / 25, 2 );
	}

	beforeEach( function before() {
		mat = matrix( d1, [5,5], 'float64' );
		out1 = matrix( d2, [5,5], 'float64' );
		out2 = matrix( d3, [5,5], 'float64' );
		out3 = matrix( d4, [5,5], 'float64' );
	});

	it( 'should export a function', function test() {
		expect( gammaincinv ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided unequal length matrices', function test() {
		expect( badValues ).to.throw( Error );
		function badValues() {
			gammaincinv( matrix( [10,10] ), mat, 1 );
		}
	});

	it( 'should throw an error if provided an exponent matrix which is not of equal dimensionality as the base matrix', function test() {
		expect( badValues ).to.throw( Error );
		function badValues() {
			gammaincinv( matrix( [5,5] ), mat, matrix( [10,10] ) );
		}
	});

	it( 'should evaluate the inverse __lower__ incomplete gamma function for each matrix element', function test() {
		var actual;

		actual = matrix( [5,5], 'float64' );
		actual = gammaincinv( actual, mat, 2 );

		assert.deepEqual( actual.data, out2.data );
	});

	it( 'should evaluate the inverse __upper__ incomplete gamma function for each matrix element', function test() {
		var actual;

		actual = matrix( [5,5], 'float64' );
		actual = gammaincinv( actual, mat, 2, 'upper' );

		assert.deepEqual( actual.data, out3.data );
	});

	it( 'should evaluate the inverse __lower__ incomplete gamma function for two input matrices', function test() {
		var actual;

		actual = matrix( [5,5], 'float64' );
		actual = gammaincinv( actual, mat, mat );

		assert.deepEqual( actual.data, out1.data );
	});

	it( 'should return an empty matrix if provided an empty matrix', function test() {
		var out, mat, expected;

		out = matrix( [0,0] );
		expected = matrix( [0,0] ).data;

		mat = matrix( [0,10] );
		assert.deepEqual( gammaincinv( out, mat, 1 ).data, expected );

		mat = matrix( [10,0] );
		assert.deepEqual( gammaincinv( out, mat, 1 ).data, expected );

		mat = matrix( [0,0] );
		assert.deepEqual( gammaincinv( out, mat, 1 ).data, expected );
	});

});
