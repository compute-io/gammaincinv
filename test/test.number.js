/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Incomplete gamma function
	gammainc = require( 'compute-gammainc' ),

	// Module to be tested:
	gammaincinv = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'number gammaincinv', function tests() {

	it( 'should export a lower and upper function', function test() {
		expect( gammaincinv.lower ).to.be.a( 'function' );
		expect( gammaincinv.upper ).to.be.a( 'function' );
	});

	it( 'should evaluate the inverse lower incomplete gamma function', function test() {
		assert.closeTo( gammaincinv.lower( 0.5, 20 ), 19.6677, 1e-3 );
		assert.closeTo( gammaincinv.lower( 0.5, 200 ), 199.667, 1e-3 );
		assert.closeTo( gammaincinv.lower( 0.8, 20 ), 23.6343, 1e-3 );
		assert.closeTo( gammaincinv.lower( 0.8, 200 ), 211.795, 1e-3 );
		assert.closeTo( gammaincinv.lower( 1e-4, 20 ), 7.44153, 1e-3 );
		assert.closeTo( gammaincinv.lower( 1e-4, 1.0001 ), 0.00010010, 1e-3 );
		assert.closeTo( gammaincinv.lower( 1e-82, 100 ), 6.108850254578676, 1e-3 );

		// check that inversion is correct for a range of values
		var d0, a, i, j, x, xr, p, erxr;
		d0 = 0;
		for ( i = 50; i < 150; i++ ) {
			a = i * 1.2 + 0.1;
			for ( j = 50; j < 150; j++ ) {
				x = j * 0.75;
				p = gammainc( x, a );
				xr = gammaincinv.lower( p, a );
				erxr = Math.abs( 1 - x/xr );
				if ( erxr > d0 ) {
					d0 = erxr;
				}
			}
		}
		assert.isTrue( d0 < 0.01 );
	});

	it( 'should evaluate the inverse upper incomplete gamma function', function test() {
		assert.closeTo( gammaincinv.upper( 0.5, 20 ), 19.6677, 1e-3 );
		assert.closeTo( gammaincinv.upper( 0.5, 200 ), 199.667, 1e-3 );
		assert.closeTo( gammaincinv.upper( 0.8, 20 ), 16.1725, 1e-3 );
		assert.closeTo( gammaincinv.upper( 0.8, 200 ), 188.011, 1e-3 );
		assert.closeTo( gammaincinv.upper( 1e-4, 2 ), 11.7564, 1e-3 );
	});

	it( 'should return NaN if provided a <= 0', function test() {
		var val;
		val = gammaincinv.lower( 0.1, 0 );
		assert.isNumber( val );
		assert.ok( val !== val );
	});


	it( 'should return NaN if provided p < 0 or p > 1', function test() {
		var val;
		val = gammaincinv.lower( -0.1, 1 );
		assert.isNumber( val );
		assert.ok( val !== val );

		val = gammaincinv.lower( 1.1, 1 );
		assert.isNumber( val );
		assert.ok( val !== val );

		val = gammaincinv.upper( -0.1, 1 );
		assert.isNumber( val );
		assert.ok( val !== val );

		val = gammaincinv.upper( 1.1, 1 );
		assert.isNumber( val );
		assert.ok( val !== val );
	});

});
