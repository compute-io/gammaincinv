/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Incomplete Gamma function
	GAMMAINCINV = require( './../lib/number.js' ),

	// Module to be tested:
	gammaincinv = require( './../lib/deepset.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'deepset gammaincinv', function tests() {

	it( 'should export a function', function test() {
		expect( gammaincinv ).to.be.a( 'function' );
	});

	it( 'should compute the inverse of the__lower__ incomplete gamma function of the array values with a scalar and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':0.2},
			{'x':0.4},
			{'x':0.6},
			{'x':0.8}
		];

		actual = gammaincinv( data, 2, 'x' );

		expected = [
			{'x': GAMMAINCINV.lower( 0.2, 2 ) },
			{'x': GAMMAINCINV.lower( 0.4, 2 ) },
			{'x': GAMMAINCINV.lower( 0.6, 2) },
			{'x': GAMMAINCINV.lower( 0.8, 2 ) }
		];

		assert.strictEqual( data, actual );
		assert.deepEqual( data, expected);

		// Custom separator...
		data = [
			{'x':[9,0.2]},
			{'x':[9,0.4]},
			{'x':[9,0.6]},
			{'x':[9,0.8]}
		];

		data = gammaincinv( data, 2, 'x/1', '/' );
		expected = [
			{'x':[9,GAMMAINCINV.lower( 0.2, 2 )]},
			{'x':[9,GAMMAINCINV.lower( 0.4, 2 )]},
			{'x':[9,GAMMAINCINV.lower( 0.6, 2 )]},
			{'x':[9,GAMMAINCINV.lower( 0.8, 2 )]}
		];

		assert.deepEqual( data, expected, 'custom separator' );
	});

	it( 'should compute the inverse of the __upper__ incomplete gamma function of the array values with a scalar and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':0.2},
			{'x':0.4},
			{'x':0.6},
			{'x':0.8}
		];

		actual = gammaincinv( data, 2, 'x', undefined, 'upper' );

		expected = [
			{'x': GAMMAINCINV.upper( 0.2, 2 ) },
			{'x': GAMMAINCINV.upper( 0.4, 2 ) },
			{'x': GAMMAINCINV.upper( 0.6, 2) },
			{'x': GAMMAINCINV.upper( 0.8, 2 ) }
		];

		assert.strictEqual( data, actual );
		assert.deepEqual( data, expected);

		// Custom separator...
		data = [
			{'x':[9,0.2]},
			{'x':[9,0.4]},
			{'x':[9,0.6]},
			{'x':[9,0.8]}
		];

		data = gammaincinv( data, 2, 'x/1', '/', 'upper' );
		expected = [
			{'x':[9,GAMMAINCINV.upper( 0.2, 2 )]},
			{'x':[9,GAMMAINCINV.upper( 0.4, 2 )]},
			{'x':[9,GAMMAINCINV.upper( 0.6, 2 )]},
			{'x':[9,GAMMAINCINV.upper( 0.8, 2 )]}
		];

		assert.deepEqual( data, expected, 'custom separator' );
	});

	it( 'should evaluate the inverse incomplete gamma function for two arrays and deep set', function test() {
		var data, actual, expected, y;

		data = [
			{'x':0.2},
			{'x':0.4},
			{'x':0.6},
			{'x':0.8}
		];

		y = [ 1, 2, 3, 4 ];

		actual = gammaincinv( data, y, 'x' );

		expected = [
			{'x':GAMMAINCINV.lower( 0.2, 1 )},
			{'x':GAMMAINCINV.lower( 0.4, 2 )},
			{'x':GAMMAINCINV.lower( 0.6, 3 )},
			{'x':GAMMAINCINV.lower( 0.8, 4 )}
		];

		assert.strictEqual( data, actual );
		assert.deepEqual( data, expected);

		// Custom separator...
		data = [
			{'x':[9,0.2]},
			{'x':[9,0.4]},
			{'x':[9,0.6]},
			{'x':[9,0.8]}
		];

		data = gammaincinv( data, y, 'x/1', '/' );
		expected = [
			{'x':[9,GAMMAINCINV.lower( 0.2, 1 )]},
			{'x':[9,GAMMAINCINV.lower( 0.4, 2 )]},
			{'x':[9,GAMMAINCINV.lower( 0.6, 3 )]},
			{'x':[9,GAMMAINCINV.lower( 0.8, 4 )]}
		];

		assert.deepEqual( data, expected, 'custom separator' );
	});

	it( 'should return an empty array if provided an empty array', function test() {
		var arr = [];
		assert.deepEqual( gammaincinv( arr, 1, 'x' ), [] );
		assert.deepEqual( gammaincinv( arr, 1, 'x', '/' ), [] );
	});

	it( 'should handle non-numeric values by setting the element to NaN', function test() {
		var data, actual, expected, y;

		// non-numeric value
		data = [
			{'x':[9,null]},
			{'x':[9,0.2]},
			{'x':[9,true]},
			{'x':[9,0.4]}
		];
		actual = gammaincinv( data, null, 'x.1' );
		expected = [
			{'x':[9,NaN]},
			{'x':[9,NaN]},
			{'x':[9,NaN]},
			{'x':[9,NaN]}
		];
		assert.deepEqual( data, expected );

		// scalar
		data = [
			{'x':[9,null]},
			{'x':[9,0.2]},
			{'x':[9,true]},
			{'x':[9,0.4]}
		];
		actual = gammaincinv( data, 1, 'x.1' );
		expected = [
			{'x':[9,NaN]},
			{'x':[9,GAMMAINCINV.lower(0.2,1)]},
			{'x':[9,NaN]},
			{'x':[9,GAMMAINCINV.lower(0.4,1)]}
		];
		assert.deepEqual( data, expected );

		// array
		data = [
			{'x':[9,null]},
			{'x':[9,0.2]},
			{'x':[9,true]},
			{'x':[9,0.4]}
		];
		y = [ 1, 2, 3, 4 ];
		actual = gammaincinv( data, y, 'x.1' );
		expected = [
			{'x':[9,NaN]},
			{'x':[9,GAMMAINCINV.lower(0.2,2)]},
			{'x':[9,NaN]},
			{'x':[9,GAMMAINCINV.lower(0.4,4)]}
		];
		assert.deepEqual( data, expected );

		// typed array
		data = [
			{'x':[9,null]},
			{'x':[9,0.2]},
			{'x':[9,true]},
			{'x':[9,0.4]}
		];
		y = new Int32Array( [1,2,3,4] );
		actual = gammaincinv( data, y, 'x.1' );
		expected = [
			{'x':[9,NaN]},
			{'x':[9,GAMMAINCINV.lower(0.2,2)]},
			{'x':[9,NaN]},
			{'x':[9,GAMMAINCINV.lower(0.4,4)]}
		];
		assert.deepEqual( data, expected );

	});

});
