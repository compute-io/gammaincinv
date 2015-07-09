'use strict';

// MODULES //

var gamma = require( 'gamma' ),
	gammainc = require( 'compute-gammainc/lib/number.js' ),
	erfcinv = require( 'compute-erfcinv/lib/number.js' );


// VARIABLES //

var SMALLEST_FLOAT32 = require( 'compute-const-smallest-float32' ).VALUE,
	LARGEST_FLOAT32 = require( 'compute-const-max-float32' ),
	SQRT_TWO_PI = Math.sqrt( 2 * Math.PI ),
	LN_SQRT_TWO_PI = Math.log( SQRT_TWO_PI );

/*
Translated from the Fortran module by
! ----------------------------------------------------------------------
! Authors:
!  Amparo Gil    (U. Cantabria, Santander, Spain)
!                 e-mail: amparo.gil@unican.es
!  Javier Segura (U. Cantabria, Santander, Spain)
!                 e-mail: javier.segura@unican.es
!  Nico M. Temme (CWI, Amsterdam, The Netherlands)
!                 e-mail: nico.temme@cwi.nl
! ---------------------------------------------------------------------
!  References:
!  1. A. Gil, J. Segura and N.M. Temme, GammaCHI: a package
!     for the inversion and computation of the gamma and
!     chi-square distribution functions (central and noncentral).
!     Computer Physics Commun
!  2. A. Gil, J. Segura and N.M. Temme. Efficient and accurate
!     algorithms for the computation and inversion
!     of the incomplete gamma function ratios. SIAM J Sci Comput.
!     (2012) 34(6), A2965-A2981
! ----------------------------------------------------------------------
! The claimed accuracy obtained using this inversion routine is near
! 1.e-12.
! ----------------------------------------------------------------------
!           METHODS OF COMPUTATION
! ----------------------------------------------------------------------
! The present code uses different methods of computation
! depending on the values of the input values: Taylor, asymptotic
! expansions and high-order Newton methods.
*/

// FUNCTIONS //

/**
* FUNCTION lambdaeta( eta )
*	lambdaeta is the positive number satisfying
*	eta^2/2=lambda-1-ln(lambda)
*	with sign(lambda-1)=sign(eta);
*
* @param {Number} eta - eta value
* @returns {Number} value satisfying equation
*/
function lambdaeta( eta ) {
	var ak = new Array(6),
		q, r, s, L, la, L2, L3, L4, L5;

	s = eta * eta * 0.5;
	if ( eta === 0 ) {
		la = 0;
	} else if ( eta < -1 ) {
		r = Math.exp( - 1 - s );
		ak[ 0 ] = 1.0;
		ak[ 1 ] = 1.0;
		ak[ 2 ] = 1.5;
		ak[ 3 ] = 2.66666666666666666666666666667;
		ak[ 4 ] = 5.20833333333333333333333333333;
		ak[ 5 ] = 10.8;
		la = r * ( ak[ 0 ] + r * ( ak[ 1 ]+r*(ak[ 2 ]+r*(ak[ 3 ]+r*(ak[ 4 ]+r*ak[ 5 ]))) ) );
	} else if ( eta < 1 ) {
		ak[ 0 ] = 1.0;
		ak[ 1 ] = 0.333333333333333333333333333333;
		ak[ 2 ] = 0.0277777777777777777777777777778;
		ak[ 3 ] = -0.00370370370370370370370370370370;
		ak[ 4 ] = 0.000231481481481481481481481481481;
		ak[ 5 ] = 0.0000587889476778365667254556143445;
		r = eta;
		la = 1.0 + r * ( ak[ 0 ] + r * ( ak[ 1 ] + r * ( ak[ 2 ] + r * ( ak[ 3 ] + r * ( ak[ 4 ] + r * ak[ 5 ] ) ) ) ) );
	} else {
		r = 11 + s;
		L = Math.log(r);
		la = r + L;
		r = 1/r;
		L2 = L * L;
		L3 = L2 * L;
		L4 = L3 * L;
		L5 = L4 * L;
		ak[ 0 ] = 1;
		ak[ 1 ] = ( 2 - L ) * 0.5;
		ak[ 2 ] =( -9 * L + 6 + 2 * L2 ) * 0.166666666666666666666666666667;
		ak[ 4 ] =(60+350*L2-300*L-125*L3+12*L4)*0.0166666666666666666666666666667;
		ak[ 3 ] = -(3*L3+36*L-22*L2-12)*0.0833333333333333333333333333333;
		ak[ 5 ] =-(-120-274*L4+900*L-1700*L2+1125*L3+20*L5)*
				0.00833333333333333333333333333333;
		la = la + L*r*( ak[ 0 ] + r * ( ak[ 1 ] + r * ( ak[ 2 ] + r * ( ak[ 3 ] + r * ( ak[ 4 ] + r * ak[ 5 ] ) ) ) ) );
	}
	r= 1;
	if ( ( (eta>-3.5) && (eta<-0.03) ) || ( (eta>0.03) && (eta<40) ) ) {
		r = 1;
		q = la;
		do {
			la = q * ( s + Math.log(q) ) / ( q - 1 );
			r = Math.abs( q/la - 1 );
			q = la;
		} while ( r > 1e-8);
	}
	return la;
}

/**
* FUNCTION ratfun( x, ak, bk )
*	Evaluates a rational function, that is a ratio of two polynomials
*
* @private
* @param {Number} x - input value
* @param {Array} ak - coefficients of first polynomial
* @param {Array} bk - coefficients of second polynomial
* @returns {Number} function value
*/
function ratfun( x, ak, bk ) {
	var p, q;
	p = ak[0] + x * ( ak[0] + x * ( ak[1] + x * ( ak[2] + x * ak[3] ) ) );
	q = bk[0] + x * ( bk[0] + x * ( bk[1] + x * ( bk[2] + x * bk[3] ) ) );
	return p/q;
} // end FUNCTION ratfun()

/**
* FUNCTION gamstar( x )
*	Computes the regulated gamma function.
*
* @private
* @param {Number} x - input value
* @returns {Number} function value
*/
function gamstar(x) {
	if ( x >= 3.0 ) {
		return Math.exp( stirling(x) );
	}
	else if (x > 0 ) {
		return gamma(x) / ( Math.exp( -x + ( x - 0.5 ) * Math.log(x) ) * SQRT_TWO_PI );
	} else {
		return LARGEST_FLOAT32;
	}
} // end FUNCTION gamstar()


/**
* FUNCTION striling( x )
*	Computes the stirling series corresponding with
*	asymptotic series for log(gamma(x))
*	that is:  1/(12x)-1/(360x**3)...; x>= 3}
*
* @private
* @param {Number} x - input value
* @returns {Number} function value
*/
function stirling( x ) {
	var a = new Array( 18 ),
	c = new Array( 7 ),
	z;
	if ( x < SMALLEST_FLOAT32 ) {
		return LARGEST_FLOAT32;
	} else if ( x < 1.0 ) {
		return gamma.log( x + 1 ) - (x+0.5) * Math.log(x) + x - LN_SQRT_TWO_PI;
	} else if ( x < 2.0 ) {
		return gamma.log( x ) - (x-0.5) * Math.log(x) + x - LN_SQRT_TWO_PI;
	} else if ( x < 3.0 ) {
		return gamma.log( x - 1 ) - (x-0.5) * Math.log(x) + x - LN_SQRT_TWO_PI + Math.log(x-1);
	} else if ( x < 12.0 ) {
		a[ 0 ] = 1.996379051590076518221;
		a[ 1 ] = -0.17971032528832887213e-2;
		a[ 2 ] = 0.131292857963846713e-4;
		a[ 3 ] = -0.2340875228178749e-6;
		a[ 4 ] = 0.72291210671127e-8;
		a[ 5 ] = -0.3280997607821e-9;
		a[ 6 ] = 0.198750709010e-10;
		a[ 7 ] = -0.15092141830e-11;
		a[ 8 ] = 0.1375340084e-12;
		a[ 9 ] = -0.145728923e-13;
		a[ 10 ] = 0.17532367e-14;
		a[ 11 ] = -0.2351465e-15;
		a[ 12 ] = 0.346551e-16;
		a[ 13 ] = -0.55471e-17;
		a[ 14 ] = 0.9548e-18;
		a[ 15 ] = -0.1748e-18;
		a[ 16 ] = 0.332e-19;
		a[ 17 ] = -0.58e-20;
		z = 18.0 / ( x * x ) - 1.0;
		return chepolsum( 17, z, a) / ( 12.0 * x );
	} else {
		z = 1.0 / ( x * x );
		if ( x < 1000.0 ) {
			c[ 0 ] = 0.25721014990011306473e-1;
			c[ 1 ] = 0.82475966166999631057e-1;
			c[ 2 ] = -0.25328157302663562668e-2;
			c[ 3 ] = 0.60992926669463371e-3;
			c[ 4 ] = -0.33543297638406e-3;
			c[ 5 ] = 0.250505279903e-3;
			c[ 6 ] = 0.30865217988013567769;
			return ((((((c[ 5 ]*z+c[ 4 ])*z+c[ 3 ])*z+c[ 2 ])*z+c[ 1 ])*z+c[ 0 ])/(c[ 6 ]+z)/x);
		} else {
			return (((-z*0.000595238095238095238095238095238+
			0.000793650793650793650793650793651)*z-
			0.00277777777777777777777777777778)*z+
			0.0833333333333333333333333333333)/x;
		}
	}
} // end FUNCTION stirling()

/**
* FUNCTION chepolsum( n, t, ak )
*	Computes the sum of a Chebyshev polynomial.
*
* @param {Number} n - degree of polynomial
* @param {Number} t - input value
* @param {Array} ak - coefficients of the Chebyshev polynomial
* @returns {Number} Chebyshev sum
*/
function chepolsum( n, t, ak) {
	var u0 = 0,
	u1 = 0,
	u2,
	k = n,
	tt = t + t;
	do {
		u2 = u1;
		u1 = u0;
		u0 = tt*u1 - u2 + ak[ k ];
	k = k - 1;
	} while ( k >= 0 );
	return ( u0 - u2 ) / 2;
} // end FUNCTION chepolsum()


/**
* FUNCTION eps1( eta )
*
* @private
* @param {Number} eta - eta value
* @returns {Number} function value
*/
function eps1(eta) {
	var la,
		ak = new Array(5),
		bk = new Array(5);
	if ( Math.abs(eta) < 1.0 ) {
		ak[ 0 ] =-3.333333333438e-1;  bk[ 0 ] = 1.000000000000e+0;
		ak[ 1 ] =-2.070740359969e-1;  bk[ 1 ] = 7.045554412463e-1;
		ak[ 2 ] =-5.041806657154e-2;  bk[ 2 ] = 2.118190062224e-1;
		ak[ 3 ] =-4.923635739372e-3;  bk[ 3 ] = 3.048648397436e-2;
		ak[ 4 ] =-4.293658292782e-5;  bk[ 4 ] = 1.605037988091e-3;
		return ratfun( eta, ak, bk );
	} else {
		la=lambdaeta(eta);
		return Math.log( eta / ( la - 1.0 ) ) / eta;
	}
} // end FUNCTION eps1()


/**
* FUNCTION eps2( eta )
*
* @private
* @param {Number} eta - eta value
* @returns {Number} function value
*/
function eps2( eta ) {
	var x, lnmeta,
		ak = new Array( 5 ),
		bk = new Array( 5 );
	if ( eta < -5.0 ) {
		x = eta * eta;
		lnmeta = Math.log( -eta );
		return ( 12 - x - 6 * ( lnmeta*lnmeta ) ) / ( 12 * x * eta );
	}
	else if (eta<-2.0) {
		ak[0]= -1.72847633523e-2;  bk[0] =1.00000000000e+0;
		ak[1]= -1.59372646475e-2;  bk[1] = 7.64050615669e-1;
		ak[2]= -4.64910887221e-3;  bk[2]= 2.97143406325e-1;
		ak[3]= -6.06834887760e-4;  bk[3]= 5.79490176079e-2;
		ak[4]= -6.14830384279e-6;  bk[4]= 5.74558524851e-3;
		return ratfun( eta, ak, bk );
	} else if (eta < 2.0) {
		ak[0]=-1.72839517431e-2;  bk[0]= 1.00000000000e+0;
		ak[1]=-1.46362417966e-2;  bk[1]= 6.90560400696e-1;
		ak[2]=-3.57406772616e-3;  bk[2]= 2.49962384741e-1;
		ak[3]=-3.91032032692e-4;  bk[3]= 4.43843438769e-2;
		ak[4]=2.49634036069e-6;   bk[4]= 4.24073217211e-3;
		return ratfun( eta, ak, bk );
	} else if (eta < 1000.0) {
		ak[0]= 9.99944669480e-1;  bk[0]= 1.00000000000e+0;
		ak[1]= 1.04649839762e+2;  bk[1]= 1.04526456943e+2;
		ak[2]= 8.57204033806e+2;  bk[2]= 8.23313447808e+2;
		ak[3]= 7.31901559577e+2;  bk[3]= 3.11993802124e+3;
		ak[4]= 4.55174411671e+1;  bk[4]= 3.97003311219e+3;
		x = 1 / eta;
		return ratfun( x, ak, bk ) / ( -12.0 * eta );
	} else {
		return -1.0 / ( 12.0 * eta );
	}
} // end FUNCTION eps2()


/**
* FUNCTION eps3( eta )
*
* @private
* @param {Number} eta - eta value
* @returns {Number} function value
*/
function eps3( eta ) {
	var eta3, x, y,
		ak = new Array( 5 ),
		bk = new Array( 5 );

	if (eta <-8.0) {
		x = eta * eta;
		y = Math.log( -eta ) / eta;
		return ( -30.0 + eta * y * ( 6.0 * x * y * y - 12.0 + x ) ) / ( 12.0 * eta * x * x );
	} else if (eta <-4.0) {
		ak[ 0 ] = 4.95346498136e-2;  bk[ 0 ]= 1.00000000000e+0;
		ak[ 1 ] = 2.99521337141e-2;  bk[ 1 ]= 7.59803615283e-1;
		ak[ 2 ] = 6.88296911516e-3;  bk[ 2 ]= 2.61547111595e-1;
		ak[ 3 ] = 5.12634846317e-4;  bk[ 3 ]= 4.64854522477e-2;
		ak[ 4 ] = -2.01411722031e-5; bk[ 4 ]= 4.03751193496e-3;
		return ratfun( eta, ak, bk ) / ( eta * eta );
	} else if (eta <-2.0) {
		ak[ 0 ] = 4.52313583942e-3;  bk[ 0 ]= 1.00000000000e+0;
		ak[ 1 ] = 1.20744920113e-3;  bk[ 1 ]= 9.12203410349e-1;
		ak[ 2 ] = -7.89724156582e-5; bk[ 2 ]= 4.05368773071e-1;
		ak[ 3 ] = -5.04476066942e-5; bk[ 3 ]= 9.01638932349e-2;
		ak[ 4 ] = -5.35770949796e-6; bk[ 4 ]= 9.48935714996e-3;
		return ratfun( eta, ak, bk);
	} else if  (eta < 2.0) {
		ak[ 0 ] = 4.39937562904e-3;  bk[ 0 ]= 1.00000000000e+0;
		ak[ 1 ] = 4.87225670639e-4;  bk[ 1 ]= 7.94435257415e-1;
		ak[ 2 ] = -1.28470657374e-4; bk[ 2 ]= 3.33094721709e-1;
		ak[ 3 ] = 5.29110969589e-6;  bk[ 3 ]= 7.03527806143e-2;
		ak[ 4 ] = 1.57166771750e-7;  bk[ 4 ]= 8.06110846078e-3;
		return ratfun( eta, ak, bk);
	} else if (eta < 10.0) {
		ak[ 0 ] = -1.14811912320e-3;  bk[ 0 ]= 1.00000000000e+0;
		ak[ 1 ] = -1.12850923276e-1;  bk[ 1 ]= 1.42482206905e+1;
		ak[ 2 ] = 1.51623048511e+0;   bk[ 2 ]= 6.97360396285e+1;
		ak[ 3 ] = -2.18472031183e-1;  bk[ 3 ]= 2.18938950816e+2;
		ak[ 4 ] = 7.30002451555e-2;   bk[ 4 ]= 2.77067027185e+2;
		x= 1.0/eta;
		return ratfun( x, ak, bk ) / ( eta * eta );
	} else if (eta < 100.0) {
		ak[ 0 ]= -1.45727889667e-4;  bk[ 0 ]= 1.00000000000e+0;
		ak[ 1 ]= -2.90806748131e-1;  bk[ 1 ]= 1.39612587808e+2;
		ak[ 2 ]= -1.33085045450e+1;  bk[ 2 ]= 2.18901116348e+3;
		ak[ 3 ]= 1.99722374056e+2;   bk[ 3 ]= 7.11524019009e+3;
		ak[ 4 ]= -1.14311378756e+1;  bk[ 4 ]= 4.55746081453e+4;
		x= 1.0/eta;
		return ratfun( x, ak, bk ) / ( eta * eta );
	} else {
		eta3 = eta * eta * eta;
		return - Math.log( eta ) / ( 12 * eta3 );
	}
} // end FUNCTION eps3()


// INVERSE INCOMPLETE GAMMA FUNCTION //


var gammaincinv = {};


/**
* FUNCTION lower( a, p )
*	Inverts the lower gamma function, i.e. computes xr such that P(a,xr)=p.
*
* @param {Number} p - probability value
* @param {Number} a - scale parameter
* @returns {Number} function value of the inverse
*/
gammaincinv.lower = function( p, a ) {
	if ( a < SMALLEST_FLOAT32 ) {
		return NaN;
	}
	if ( ( p > 1 ) || ( p < 0 ) ) {
		return NaN;
	} else if ( p === 0 ) {
		return 0;
	} else if ( p === 1 ) {
		return Number.POSITIVE_INFINITY;
	}
	return compute( a, p, 1 - p );
}; // end METHOD lower()


/**
* FUNCTION upper( a, p )
*	Inverts the upper gamma function, i.e. computes xr such that Q(a,xr)=p.
*
* @param {Number} p - probability value
* @param {Number} a - scale parameter
* @returns {Number} function value of the inverse
*/
gammaincinv.upper = function( p, a ) {
	if ( a < SMALLEST_FLOAT32 ) {
		return NaN;
	}
	if ( ( p > 1 ) || ( p < 0 ) ) {
		return NaN;
	} else if ( p === 0 ) {
		return Number.POSITIVE_INFINITY;
	} else if ( p === 1 ) {
		return 0;
	}

	return compute( a, 1 - p, p );
}; // end METHOD upper()


/**
* FUNCTION: compute( a, p, q )
*	This routine computes xr in the equations P(a,xr)=p
*	and Q(a,xr)=q with a as a given positive parameter;
*	p and q satisfy p+q=1. The equation is inverted with min(p,q).
*
* @private
* @param {Number} a - scale value of incomplete gamma function
* @param {Number} p - probability value
* @param {Number} q - probability value
* @returns {Number} solution of the equations P(a,xr)=p and Q(a,xr)=q
* with a as a given positive parameter.
*/
function compute( a, p, q ) {
	var porq, s, p2, p3, p4, p5,p6, dlnr, logr, r,
		a2, a3, a4, ap1, ap12, ap13, ap14, ap2, ap22, ap3,
		ainv, ap1inv, x0, b, eta, L, L2, L3, L4, b2, b3, x,
		x2, t, px, qx, y, vmin, vgam, lgama, fp, invfp, xini,
		k, n, m, i, pcase, xr, warning;
	var ck = new Array( 5 );

	if ( p < 0.5) {
		pcase = true;
		porq = p;
		s = -1;
	} else {
		pcase = false;
		porq = q;
		s = 1;
	}

	k = 0;

	if ( Math.abs( a - 1 ) < 1e-4 ) {
		m = 0;
		if ( pcase ) {
			if ( p < 1e-3 ) {
				p2 = p * p;
				p3 = p2 * p;
				p4 = p3 * p;
				p5 = p4 * p;
				p6 = p5 * p;
				x0 = p + p2 * 0.5 + p3 * (1/3) + p4 * 0.25 + p5 * 0.2 + p6 * (1/6);
			} else {
				x0 = - Math.log( 1 - p );
			}
		} else {
			x0 = - Math.log( q );
		}
		if ( a === 1 ) {
			k = 2;
			xr = x0;
		} else {
			lgama = gamma.log( a );
			k = 1;
		}
	}

	if ( q < 1e-30 && a < 0.5 ) {
		m = 0;
		x0 = - Math.log( q * gamma(a) ) + ( a - 1 ) * Math.log( -Math.log( q * gamma(a) ) );
		k = 1;
		lgama = gamma.log( a );
	}

	if ( a > 1 && a < 500 && p < 1e-80 ) {
		m = 0;
		ainv = 1 / a;
		ap1inv = 1 / ( a + 1 );
		x0 = ( gamma.log( a + 1 )+ Math.log( p ) ) * ainv;
		x0 = Math.exp( x0 );
		xini = x0;
		for ( i = 0; i < 10; i++ ) {
			x0 = xini * Math.exp( x0 * ainv ) * Math.pow( 1.0 - x0 * ap1inv, ainv );
		}
		k = 1;
		lgama = gamma.log( a );
	}

	logr = (1/a) * ( Math.log(p) + gamma.log( a + 1 ) );

	if ( ( logr < Math.log( 0.2 * ( 1 + a ) ) ) && ( k === 0 ) ) {
		r = Math.exp( logr );
		m = 0;
		a2 = a * a;
		a3 = a2 * a;
		a4 = a3 * a;
		ap1 = a + 1;
		ap12 = ap1 * ap1;
		ap13 = ap1 * ap12;
		ap14 = ap12 * ap12;
		ap2 = a + 2;
		ap22 = ap2 * ap2;
		ap3 = a + 3;
		ck[ 0 ] = 1;
		ck[ 1 ] = 1 / ap1;
		ck[ 2 ] = 0.5 * ( 3 * a + 5 ) / ( ap12 * ap2 );
		ck[ 3 ] = (1/3) * ( 31 + 8 * a2 + 33 * a ) / ( ap13 * ap2 * ap3 );
		ck[ 4 ] = 0.0416666666666666666666666666667 *( 2888 + 1179 * a3 + 125 * a4 + 3971 * a2 + 5661 * a ) / ( ap14 * ap22 * ap3 * ( a + 4 ) );
		x0 = r * ( 1 + r * ( ck[ 1 ] + r * ( ck[ 2 ] + r * ( ck[ 3 ] + r * ck[ 4 ] ) ) ) );
		lgama = gamma.log( a );
		k = 1;
	}

	if ( ( a < 10 ) && ( k === 0 ) ) {
		vgam = Math.sqrt( a ) / ( gamstar(a) * SQRT_TWO_PI );
		vmin = Math.min( 0.02, vgam );
		if ( q < vmin ) {
			m = 0;
			b = 1 - a;
			b2 = b * b;
			b3 = b2 * b;
			eta = Math.sqrt( -2/a * Math.log( q / vgam ) );
			x0 = a * lambdaeta(eta);
			L = Math.log( x0 );
			if ( x0 > 5 ) {
				L2 = L * L;
				L3 = L2 * L;
				L4 = L3 * L;
				r = 1 / x0;
				ck[ 0 ] = L - 1;
				ck[ 1 ] = ( 3 * b - 2 * b * L + L2 - 2 * L + 2 ) * 0.5;
				ck[ 2 ] =(24*b*L-11*b2-24*b-6*L2+12*L-12-9*b*L2+6*b2*L+2*L3)*
					0.166666666666666666666666666667;
				ck[ 3 ] =(-12*b3*L+84*b*L2-114*b2*L+72+36*L2+3*L4-
					72*L+162*b-168*b*L-12*L3+25*b3-
					22*b*L3+36*b2*L2+120*b2)*0.0833333333333333333333333333333;
				x0 = x0 - L + b * r * ( ck[ 0 ] + r * ( ck[ 1 ] + r * ( ck[ 2 ] + r * ck[ 3 ] ) ) );
			} else {
				r = 1 / x0;
				L2 = L * L;
				ck[ 0 ] = L - 1;
				if ( ( L - b * r * ck[ 0 ] ) < x0 ) {
					x0 = x0 - L + b * r * ck[ 0 ];
				}
			}
			lgama = gamma.log( a );
			k = 1;
		}
	}

	if ( ( Math.abs( porq - 0.5 ) < 1e-5 ) && ( k === 0 ) ) {
		m = 0;
		ainv = 1 / a;
		x0 = a - (1/3) + (0.0197530864197530864197530864198 + 0.00721144424848128551832255535959 * ainv) * ainv;
		lgama = gamma.log( a );
		k = 1;
	}

	if ( ( a < 1 ) && ( k === 0 ) ) {
		m = 0;
		if (pcase) {
			x0 = Math.exp( (1/a) * ( Math.log(porq) + gamma.log(a+1) ) );
		} else {
			x0 = Math.exp( (1/a) * ( Math.log(1-porq) + gamma.log(a+1) ) );
		}
		lgama = gamma.log( a );
		k = 1;
	}
	if ( k === 0 ) {
		m = 1;
		ainv = 1 / a;
		r = erfcinv( 2 * porq );
		eta = s * r / Math.sqrt( a * 0.5 );
		if ( r < LARGEST_FLOAT32 ) {
			eta = eta + ( eps1(eta)+(eps2(eta)+eps3(eta)*ainv ) * ainv ) * ainv;
			x0 = a * lambdaeta(eta);
			y = eta;
			fp = - Math.sqrt( a / (2*Math.PI) ) * Math.exp( -0.5*a*y*y ) / ( gamstar(a) );
			invfp = 1 / fp;
		} else {
			warning = 'Warning: Overflow problems in one or more steps of the computation.';
			console.log( warning );
			return NaN;
		}
	}
	x = x0;
	if ( k < 2 ) {
		t = 1;
		n = 1;
		a2 = a * a;
		a3 = a2 * a;
		xini = x0;
		// Implementation of the high order Newton-like method
		do {
			x = x0;
			x2 = x * x;
			if ( m === 0 ) {
				dlnr = ( 1 - a ) * Math.log( x ) + x + lgama;
				if ( dlnr > Math.log( LARGEST_FLOAT32 ) ) {
					warning = 'Warning: overflow problems in one or more steps of the computation.';
					warning += 'The initial approximation to the root is returned.';
					console.log( warning );
					return xini;
				} else {
					r = Math.exp(dlnr);
				}
			} else {
				r = - invfp * x;
			}
			if (pcase) {
				px = gammainc.lower( x, a );
				ck[ 0 ] = - r * ( px - p );
			} else {
				qx = gammainc.upper( x, a );
				ck[ 0 ] = r * ( qx - q );
			}
			r = ck[ 0 ];
			if ( ( p > 1e-120 ) || ( n > 1 ) ) {
				ck[ 1 ] = 0.5 * ( x - a + 1 ) / x;
				ck[ 2 ] = 0.166666666666666666666666666667 *
					(2*x2-4*x*a+4*x+2*a2-3*a+1) / x2;
				x0 = x + r * ( 1 + r * ( ck[ 1 ] + r * ck[ 2 ] ) );
			} else {
				x0 = x + r;
			}
			t = Math.abs( x/x0 - 1 );
			n = n + 1;
			x = x0;
			if ( x < 0 ) {
				x = xini;
				n = 100;
			}
		} while ( ( ( t > 2e-14) && ( n < 35 ) ) );
		if ( ( t > 2e-14 ) || ( n > 99 ) ) {
			warning = 'Warning: the number of iterations in the Newton method reached the upper limit N=35.\n';
			warning += 'The last value obtained for the root is given as output.';
			console.log( warning );
		}
		xr = x;
	}
	return xr;
} // end FUNCTION compute()


// EXPORTS //

module.exports = gammaincinv;
