/**
 * @license MIT
 */

'use strict';

const styles = require( '../lib/styles.js' )();

describe( 'styles', () => {
	it( 'are defined as functions', () => {
		expect( styles ).to.be.an.object;
		expect( Object.keys( styles ) ).to.have.length( 37 );

		for ( const name in styles ) {
			expect( styles[ name ] ).to.be.a.function;
		}
	} );
} );