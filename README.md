gammaincinv
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

>  Inverse incomplete gamma function.

Computes the inverse of the lower [incomplete gamma function](https://en.wikipedia.org/wiki/Incomplete_gamma_function)

<div class="equation" align="center" data-raw-text="P( x, a ) = \frac{\gamma(a,x)}{\Gamma(a)} = \frac{1}{\Gamma(a)} \int_0^x t^{a-1} e^{-t} \; dt" data-equation="eq:lower_incomplete_gamma">
	<img src="https://cdn.rawgit.com/compute-io/gammainc/68d3e61dfeace303cffe14b75c5b249ba75b5281/docs/img/eqn1.svg" alt="Equation for the regularized lower incomplete gamma function.">
	<br>
</div>

Specifically, for given `p` and `a` it finds the `x` such that `p =  P(x, a)`.

The function can also be used to invert the upper incomplete gamma function, which is defined as follows:  

<div class="equation" align="center" data-raw-text="Q( x, a ) = \frac{\Gamma(a,x)}{\Gamma(a)} = \frac{1}{\Gamma(a)} \int_x^\infty t^{a-1} e^{-t} \; dt" data-equation="eq:upper_incomplete_gamma">
	<img src="https://cdn.rawgit.com/compute-io/gammainc/68d3e61dfeace303cffe14b75c5b249ba75b5281/docs/img/eqn2.svg" alt="Equation for the regularized upper incomplete gamma function.">
	<br>
</div>

Again, for given `p` and `a` the function returns the `x` which satisfies `p = Q(x, a)`.

## Installation

``` bash
$ npm install compute-gammaincinv
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var gammaincinv = require( 'compute-gammaincinv' );
```

#### gammaincinv( p, a[, opts] )

Inverts element-wise the regularized incomplete gamma function. `p` can be a number, array, typed array or matrix. `a` has to be either an array or matrix of equal dimensions as `p` or a single number. The function returns either an array with the same length as the `p` array, a matrix with the same dimensions as the `p` matrix or a single number. Contrary to the more commonly used definitoon, in this implementation the first argument is `p` and the second argument is the scale factor `a`.

``` javascript
var matrix = require( 'dstructs-matrix' ),
	data,
	mat,
	out,
	i;

out = gammaincinv( 0.5, 20 );
// returns ~19.668

out = gammaincinv( 1e-4, 1.0001 );
// returns ~0.0001

data = [ 0.1, 0.2, 0.3 ];
out = gammaincinv( 0.9, data );
// returns [ ~0.266, ~0.605, ~0.885 ]

out = gammaincinv( data, 2 );
// returns [ ~0.532, ~0.824, ~1.097 ]

data = new Float32Array( [0.1,0.2,0.3] );
out = gammaincinv( data, 2 );
// returns Float64Array( [~0.532,~0.824,~1.097] )

data = new Float32Array( 6 );
for ( i = 0; i < 6; i++ ) {
	data[ i ] = i / 6;
}
mat = matrix( data, [3,2], 'float32' );
/*
	[    0  1/6
	   2/6  3/6
	   4/6  5/6 ]
*/

out = gammaincinv( mat, 4 );
/*
	[  0      ~6.972
	  ~8.394  ~9.669
	  ~11.067 ~12.987 ]
*/
```

The function accepts the following `options`:

* 	__accessor__: accessor `function` for accessing `array` values.
* 	__dtype__: output [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix) data type. Default: `float64`.
*	__copy__: `boolean` indicating if the `function` should return a new data structure. Default: `true`.
*	__path__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path.
*	__sep__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path separator. Default: `'.'`.
*	__tail__:`string` indicating whether to evaluate the `'lower'` or `'upper'` incomplete gamma function. Default: `'lower'`.
*	__regularized__: `boolean` indicating if the `function` should compute the *regularized* or *unregularized* incomplete gamma functions. Default: `true`.

By default, the function inverts the *lower* regularized incomplete gamma function, `P(x,a)`. To invert the *upper* function instead, i.e. `Q(x,a)`, set the `tail` option to `'upper'`.

```javascript
var l, u, bool;

l = gammaincinv( 0.6, 2 )
// returns ~2.022

u = gammaincinv( 0.6, 2, {
	'tail': 'upper'
});
// returns ~1.376
```

For object `arrays`, provide an accessor `function` for accessing `array` values.

``` javascript
data = [
	{'x':0.1},
	{'x':0.2},
	{'x':0.3},
	{'x':0.4},
	{'x':0.5},
	{'x':0.6},
	{'x':0.7},
	{'x':0.8}
	{'x':0.9}
];

function getValue( d, i ) {
	return d.x;
}

var out = gammaincinv( data, 10, {
	'accessor': getValue
});
// returns [ ~6.221, ~7.289, ~8.133, ~8.904, ~9.669, ~10.476, ~11.388, ~12.519, ~14.206 ]
```

When inverting the [incomplete gamma function](https://en.wikipedia.org/wiki/Incomplete_gamma_function) for values between two object `arrays`, provide an accessor `function` which accepts `3` arguments.

``` javascript
var data = [
	['beep', 0.1],
	['boop', 0.2],
	['bip', 0.3],
	['bap', 0.4],
	['baz', 0.5]
];

var arr = [
	{'x': 1},
	{'x': 2},
	{'x': 3},
	{'x': 4},
	{'x': 5}
];

function getValue( d, i, j ) {
	if ( j === 0 ) {
		return d[ 1 ];
	}
	return d.x;
}

var out = gammaincinv( data, arr, {
	'accessor': getValue
});
// returns [ ~0.105, ~0.824, ~1.914, ~3.211, ~4.671 ]
```

__Note__: `j` corresponds to the input `array` index, where `j=0` is the index for the first input `array` and `j=1` is the index for the second input `array`.

To [deepset](https://github.com/kgryte/utils-deep-set) an object `array`, provide a key path and, optionally, a key path separator.

``` javascript
var data = [
	{'x':[0,0.1]},
	{'x':[1,0.2]},
	{'x':[2,0.3]},
	{'x':[3,0.4]},
	{'x':[4,0.5]}
];

var out = gammaincinv( data, 4, 'x|1', '|' );
/*
	[
		{'x':[0,~1.745]},
		{'x':[1,~2.297]},
		{'x':[2,~2.764]},
		{'x':[3,~3.211},
		{'x':[4,~3.672]}
	]
*/

var bool = ( data === out );
// returns true
```

By default, when provided a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix), the output data structure is `float64` in order to preserve precision. To specify a different data type, set the `dtype` option (see [`matrix`](https://github.com/dstructs/matrix) for a list of acceptable data types).

``` javascript
var data, out;

data = new Float64Array( [ 0.1, 0.2, 0.3 ] );

out = gammaincinv( data, 5, {
	'dtype': 'int32',
});
// returns Int32Array( [2,3,3] )

// Works for plain arrays, as well...
out = gammaincinv( [0.1, 0.2, 0.3 ], 5, {
	'dtype': 'uint8'
});
// returns Uint8Array( [2,3,3] )
```

By default, the function returns a new data structure. To mutate the input data structure, set the `copy` option to `false`.

``` javascript
var data,
	bool,
	mat,
	out,
	i;

data = [ 0.1, 0.2, 0.3 ];

out = gammaincinv( data, 2, {
	'copy': false
});
// returns  [ ~0.532, ~0.824, ~1.097 ]

bool = ( data === out );
// returns true

data = new Float32Array( 6 );
for ( i = 0; i < 6; i++ ) {
	data[ i ] = i / 6;
}
mat = matrix( data, [3,2], 'float32' );
/*
	[  0   1/6
	  2/6  3/6
	  4/6  5/6 ]
*/

out = gammaincinv( mat, 4, {
	'copy': false
});
/*
	[  0      ~6.972
	  ~8.394  ~9.669
	  ~11.067 ~12.987 ]
*/

bool = ( mat === out );
// returns true
```


## Notes

*	If an element is __not__ a numeric value, the returned value  is `NaN`.

	``` javascript
	var data, out;

	out = gammaincinv( null, 1 );
	// returns NaN

	out = gammaincinv( true, 1 );
	// returns NaN

	out = gammaincinv( {'a':'b'}, 1 );
	// returns NaN

	out = gammaincinv( [ true, null, [] ], 1 );
	// returns [ NaN, NaN, NaN ]

	function getValue( d, i ) {
		return d.x;
	}
	data = [
		{'x':true},
		{'x':[]},
		{'x':{}},
		{'x':null}
	];

	out = gammaincinv( data, 1, {
		'accessor': getValue
	});
	// returns [ NaN, NaN, NaN, NaN ]

	out = gammaincinv( data, 1, {
		'path': 'x'
	});
	/*
		[
			{'x':NaN},
			{'x':NaN},
			{'x':NaN,
			{'x':NaN}
		]
	*/
	```

*	Be careful when providing a data structure which contains non-numeric elements and specifying an `integer` output data type, as `NaN` values are cast to `0`.

	``` javascript
	var out = gammaincinv( [ true, null, [] ], 1, {
		'dtype': 'int8'
	});
	// returns Int8Array( [0,0,0] );
	```

*	When calling the function with a numeric value as the first argument and a `matrix` or `array` as the second argument, only the `dtype` option is applicable.

	``` javascript
		// Valid:
		var out = gammaincinv( 1, [ 1, 2, 3 ], {
			'dtype': 'int8'
		});
		// returns Int8Array( [0,0,0] )

		// Not valid:
		var out = gammaincinv( 0.5, [ 1, 2, 3 ], {
			'copy': false
		});
		// throws an error
	```

## Implementation

The code used to calculate the inverse incomplete gamma function has been translated from the Fortran module `GammaCHI` by Amparo Gil, Javier Segura and
Nico M. Temme. It uses different methods of computation
depending on the values of the input values: Taylor, asymptotic
expansions and high-order Newton methods.

## References

1. A. Gil, J. Segura and N.M. Temme, GammaCHI: a package for the inversion and computation of the gamma and chi-square distribution functions (central and noncentral). Computer Physics Commun
2. A. Gil, J. Segura and N.M. Temme. Efficient and accurate algorithms for the computation and inversion of the incomplete gamma function ratios. SIAM J Sci Comput. (2012) 34(6), A2965-A2981

## Examples

``` javascript
var matrix = require( 'dstructs-matrix' ),
	gammaincinv = require( 'compute-gammaincinv' );

var data,
	mat,
	out,
	tmp,
	i;

// Plain arrays...
data = new Array( 100 );
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}
out = gammaincinv( data, 1 );

// Object arrays (accessors)...
function getValue( d ) {
	return d.x;
}
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = {
		'x': data[ i ]
	};
}
out = gammaincinv( data, 1, {
	'accessor': getValue
});

// Deep set arrays...
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = {
		'x': [ i, data[ i ].x ]
	};
}
out = gammaincinv( data, 1, {
	'path': 'x/1',
	'sep': '/'
});

// Typed arrays...
data = new Float64Array( 100 );
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}
tmp = gammaincinv( data, 1 );
out = '';
for ( i = 0; i < data.length; i++ ) {
	out += tmp[ i ];
	if ( i < data.length-1 ) {
		out += ',';
	}
}

// Matrices...
mat = matrix( data, [10,10], 'float64' );
out = gammaincinv( mat, 1 );

// Matrices (custom output data type)...
out = gammaincinv( mat, 1, {
	'dtype': 'float32'
});
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; <%= year %>. The [Compute.io](https://github.com/compute-io) Authors.

[npm-image]: http://img.shields.io/npm/v/compute-gammaincinv.svg
[npm-url]: https://npmjs.org/package/compute-gammaincinv

[travis-image]: http://img.shields.io/travis/compute-io/gammaincinv/master.svg
[travis-url]: https://travis-ci.org/compute-io/gammaincinv

[coveralls-image]: https://img.shields.io/coveralls/compute-io/gammaincinv/master.svg
[coveralls-url]: https://coveralls.io/r/compute-io/gammaincinv?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/gammaincinv.svg
[dependencies-url]: https://david-dm.org/compute-io/gammaincinv

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/gammaincinv.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/gammaincinv

[github-issues-image]: http://img.shields.io/github/issues/compute-io/gammaincinv.svg
[github-issues-url]: https://github.com/compute-io/gammaincinv/issues
