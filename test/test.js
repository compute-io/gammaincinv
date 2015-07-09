/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Validate if a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to check whether values are infinite
	isinf = require( 'compute-isinf' ),

	// Inverse incomplete gamma function:
	GAMMAINCINV = require( './../lib/number.js' ).lower,

	// Module to be tested:
	gammaincinv = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-gammaincinv', function tests() {

	it( 'should export a function', function test() {
		expect( gammaincinv ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				gammaincinv( [1,2,3], 1, {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided aunrecognized/unsupported tail option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				gammaincinv( [1,2,3], 1, {
					'tail': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				gammaincinv( [1,2,3], 1, {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a typed-array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				gammaincinv( new Int8Array([1,2,3]), 1, {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				gammaincinv( matrix( [2,2] ), 1, {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a number as the first argument and an not applicable option', function test() {
		var values = [
			{'accessor': function getValue( d ) { return d; } },
			{'copy': false},
			{'path': 'x'},
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				gammaincinv( 1, [1,2,3], value );
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			NaN,
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( gammaincinv( values[ i ], 1 ) ) );
		}
	});

	it( 'should return NaN if the first argument is a number and the second argument is neither numberic, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			NaN,
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( gammaincinv( 1, values[ i ] ) ) );
		}
	});

	it( 'should calculate the inverse of the __lower__ incomplete gamma function for two numbers', function test() {
		assert.closeTo( gammaincinv( 0.3, 10 ), 8.13293, 1e-3 );
		assert.closeTo( gammaincinv( 0.7, 10 ), 11.3873, 1e-3 );
	});

	it( 'should calculate the inverse of the __upper__ incomplete gamma function for two numbers', function test() {
		assert.closeTo( gammaincinv( 0.3, 10, {'tail': 'upper'} ), 11.3873, 1e-3 );
		assert.closeTo( gammaincinv( 0.7, 10, {'tail': 'upper'} ), 8.13293, 1e-3 );
	});

	it( 'should calculate the inverse incomplete gamma function of a scalar and an array', function test() {
		var data, actual, expected;
		data = [ 1, 2 ];
		actual = gammaincinv( 0.5, data );
		expected = [ GAMMAINCINV( 0.5, 1 ), GAMMAINCINV( 0.5, 2 ) ];
		assert.deepEqual( actual, expected );
	});

	it( 'should calculate the inverse incomplete gamma function of a scalar and a matrix', function test() {
		var data, actual, expected;
		data = matrix( new Int8Array( [ 1,2,3,4 ] ), [2,2] );
		actual = gammaincinv( 0.5, data );
		expected = matrix( new Float64Array( [
			GAMMAINCINV( 0.5, 1 ),
			GAMMAINCINV( 0.5, 2 ),
			GAMMAINCINV( 0.5, 3 ),
			GAMMAINCINV( 0.5, 4 ),
		]), [2,2] );

		assert.deepEqual( actual.data, expected.data );
	});


	it( 'should calculate inverse incomplete gamma function of a scalar and an array and cast result to a different dtype', function test() {
		var data, actual, expected;
		data = [ 1, 10 ];
		actual = gammaincinv( 0.8, data, {
			'dtype':'int32'
		});
		expected = new Int32Array([
			GAMMAINCINV( 0.8, 1 ),
			GAMMAINCINV( 0.8, 10 )
		]);
		assert.deepEqual( actual, expected );
	});


	it( 'should calculate the inverse incomplete gamma function of a scalar and a matrix and cast to a different dtype', function test() {
		var data, actual, expected;
		data = matrix( new Int8Array( [ 1,2,3,4 ] ), [2,2] );
		actual = gammaincinv( 0.8, data, {
			'dtype': 'float32'
		});
		expected = matrix( new Float32Array( [
			GAMMAINCINV( 0.8, 1 ),
			GAMMAINCINV( 0.8, 2 ),
			GAMMAINCINV( 0.8, 3 ),
			GAMMAINCINV( 0.8, 4 ),
		]), [2,2] );

		assert.strictEqual( actual.dtype, 'float32' );
		assert.deepEqual( actual.data, expected.data );
	});

	it( 'should calculate the inverse incomplete gamma function when provided a plain array and a scalar', function test() {
		var data, actual, expected, i;

		data = [ 0.25, 0.5, 0.75 ];
		expected = [
			1.7273,
			2.67406,
			3.9204,
		];

		actual = gammaincinv( data, 3 );
		assert.notEqual( actual, data );

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}

		// Mutate...
		actual = gammaincinv( data, 3, {
			'copy': false
		});
		assert.strictEqual( actual, data );

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}

	});

	it( 'should evaluate the inverse incomplete gamma function when provided a plain array and another array', function test() {
		var data, y, actual, expected, i;

		data = [ 0.25, 0.5, 0.75 ];
		y = [ 0.75, 0.5, 0.25 ];
		expected = [
			0.153408,
			0.227468,
			0.260626
		];

		actual = gammaincinv( data, y );
		assert.notEqual( actual, data );

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}

		// Mutate...
		actual = gammaincinv( data, y, {
			'copy': false
		});
		assert.strictEqual( actual, data );

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}

	});

	it( 'should evaluate the inverse incomplete gamma function when provided a typed array and a scalar', function test() {
		var data, actual, expected, i;

		data = new Float32Array( [ 0.25, 0.5, 0.75 ] );

		expected = new Float64Array( [
			1.7273,
			2.67406,
			3.9204
		]);

		actual = gammaincinv( data, 3 );
		assert.notEqual( actual, data );

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}

		// Mutate:
		actual = gammaincinv( data, 3, {
			'copy': false
		});
		assert.strictEqual( actual, data );

		expected = new Float32Array( [
			1.7273,
			2.67406,
			3.9204
		]);

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}
	});

	it( 'should evaluate the inverse incomplete gamma function when provided a typed array and another typed array', function test() {
		var data, actual, expected, i;

		data = new Float32Array( [
			0.1,
			0.2,
			0.3,
			0.4,
			0.5
		] );

		expected = new Float64Array( [
			6.073048362743211e-11,
			0.000208852,
			0.0127267,
			0.0793619,
			0.227468
		] );

		actual = gammaincinv( data, data );
		assert.notEqual( actual, data );

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}

		// Mutate:

		actual = gammaincinv( data, data, {
			'copy': false,
		});
		expected = new Float32Array( [
			6.073048362743211e-11,
			0.000208852,
			0.0127267,
			0.0793619,
			0.227468
		] );
		assert.strictEqual( actual, data );

		for ( i = 0; i < expected.length; i++ ) {
			assert.closeTo( expected[ i ], actual[ i ], 1e-4);
		}
	});

	it( 'should evaluate the inverse incomplete gamma function for an array and a scalar and return an array of a specific type', function test() {
		var data, actual, expected;

		data = [ 0.2, 0.4, 0.6, 0.8 ];
		expected = new Int8Array( [ 2, 3, 4, 5 ] );

		actual = gammaincinv( data, 4, {
			'dtype': 'int8'
		});
		assert.notEqual( actual, data );
		assert.strictEqual( actual.BYTES_PER_ELEMENT, 1 );
		assert.deepEqual( actual, expected );
	});

	it( 'should evaluate the inverse incomplete gamma function for an array and a scalar using an accessor', function test() {
		var data, actual, expected, i;

		data = [
			[0,0],
			[1,0.1],
			[2,0.2],
			[3,0.3],
			[4,0.4],
			[5,0.5],
			[6,0.6],
			[7,0.7],
			[8,0.8],
			[9,0.9],
			[10,1],
		];

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

		actual = gammaincinv( data, 1, {
			'accessor': getValue
		});
		assert.notEqual( actual, data );

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isinf( actual[ i ] ) || !isinf( expected[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4);
			}
		}

		// Mutate:
		actual = gammaincinv( data, 1, {
			'accessor': getValue,
			'copy': false
		});
		assert.strictEqual( actual, data );

		for ( i = 0; i < expected.length; i++ ) {
			if ( !isinf( actual[ i ] ) || !isinf( expected[ i ] ) ) {
				assert.closeTo( expected[ i ], actual[ i ], 1e-4);
			}
		}

		function getValue( d ) {
			return d[ 1 ];
		}
	});

	it( 'should evaluate the inverse incomplete gamma function of two object arrays using an accessor', function test() {
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

		actual = gammaincinv( data, y, {
			'accessor': getValue
		});

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

	it( 'should evaluate the inverse incomplete gamma function with a numeric scale factor and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':[3,0.2]},
			{'x':[4,0.4]},
			{'x':[5,0.6]},
			{'x':[6,0.8]}
		];
		expected = [
			{'x':[3,GAMMAINCINV( 0.2, 3 )]},
			{'x':[4,GAMMAINCINV( 0.4, 3 )]},
			{'x':[5,GAMMAINCINV( 0.6, 3 )]},
			{'x':[6,GAMMAINCINV( 0.8, 3 )]}
		];

		actual = gammaincinv( data, 3, {
			'path': 'x.1'
		});

		assert.strictEqual( actual, data );

		assert.deepEqual( actual, expected );

		// Specify a path with a custom separator...
		data = [
			{'x':[3,0.2]},
			{'x':[4,0.4]},
			{'x':[5,0.6]},
			{'x':[6,0.8]}
		];
		actual = gammaincinv( data, 3, {
			'path': 'x/1',
			'sep': '/'
		});
		assert.strictEqual( actual, data );

		assert.deepEqual( actual, expected );
	});

	it( 'should perform an element-wise gammaincer using an array and deep set', function test() {
		var data, actual, expected, y;

		data = [
			{'x':0.2},
			{'x':0.4},
			{'x':0.6},
			{'x':0.8}
		];

		y = [ 1, 2, 3, 4 ];

		actual = gammaincinv( data, y, {
			path: 'x'
		});

		expected = [
			{'x': GAMMAINCINV( 0.2, 1 ) },
			{'x': GAMMAINCINV( 0.4, 2 ) },
			{'x': GAMMAINCINV( 0.6, 3) },
			{'x': GAMMAINCINV( 0.8, 4 ) }
		];

		assert.strictEqual( data, actual );
		assert.deepEqual( data, expected);

		data = [
		// Custom separator...
			{'x':[9,0.2]},
			{'x':[9,0.4]},
			{'x':[9,0.6]},
			{'x':[9,0.8]}
		];

		data = gammaincinv( data, y, {
			'path': 'x/1',
			'sep': '/'
		});
		expected = [
			{'x':[9,GAMMAINCINV( 0.2, 1 )]},
			{'x':[9,GAMMAINCINV( 0.4, 2 )]},
			{'x':[9,GAMMAINCINV( 0.6, 3 )]},
			{'x':[9,GAMMAINCINV( 0.8, 4 )]}
		];

		assert.deepEqual( data, expected, 'custom separator' );
	});

	it( 'should evaluate the inverse incomplete gamma function when provided a matrix', function test() {
		var mat,
			out,
			d1,
			d2,
			d3,
			i;

		d1 = new Float64Array( 25 );
		d2 = new Float64Array( 25 );
		d3 = new Float64Array( 25 );
		for ( i = 1; i <= d1.length; i++ ) {
			d1[ i-1 ] = i / 25;
			d2[ i-1 ] = GAMMAINCINV( i / 25, i / 25 );
			d3[ i-1 ] = GAMMAINCINV( i / 25, 2 );
		}

		// matrix elements + scalar
		mat = matrix( d1, [5,5], 'float64' );
		out = gammaincinv( mat, 2, {
			'dtype': 'float64'
		});

		assert.deepEqual( out.data, d3 );

		// matrix elements + matrix elements
		mat = matrix( d1, [5,5], 'float64' );
		out = gammaincinv( mat, mat, {
			'dtype': 'float64'
		});

		assert.deepEqual( out.data, d2 );

		// matrix elements + scalar and mutate
		out = gammaincinv( mat, 2, {
			'copy': false
		});

		assert.strictEqual( mat, out );
		assert.deepEqual( mat.data, d3 );
	});

	it( 'should evaluate the inverse incomplete gamma function for a matrix and a scalar scale factor and return a matrix of a specific type', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( 100 );
		d2 = new Float64Array( 100 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i / 100;
			d2[ i ] = GAMMAINCINV( i / 100, 2 );
		}
		mat = matrix( d1, [10,10], 'float64' );
		out = gammaincinv( mat, 2, {
			'dtype': 'float64'
		});

		assert.strictEqual( out.dtype, 'float64' );
		assert.deepEqual( out.data, d2 );
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( gammaincinv( [], 1 ), [] );
		assert.deepEqual( gammaincinv( matrix( [0,0] ), 1 ).data, matrix( [0,0] ).data );
		assert.deepEqual( gammaincinv( new Int8Array(), 1 ), new Float64Array() );
	});

});
