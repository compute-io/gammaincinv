/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

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
	});

	it( 'should evaluate the inverse upper incomplete gamma function', function test() {
		assert.closeTo( gammaincinv.upper( 0.5, 20 ), 19.6677, 1e-3 );
		assert.closeTo( gammaincinv.upper( 0.5, 200 ), 199.667, 1e-3 );
		assert.closeTo( gammaincinv.upper( 0.8, 20 ), 16.1725, 1e-3 );
		assert.closeTo( gammaincinv.upper( 0.8, 200 ), 188.011, 1e-3 );
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
	});

});
