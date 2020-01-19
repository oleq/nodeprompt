/**
 * @license MIT
 */

/* global process */

'use strict';

const styles = require( '../lib/styles.js' )();

describe( 'styles', () => {
	it( 'are defined as functions', () => {
		expect( styles ).to.be.an( 'object' );
		expect( Object.keys( styles ) ).to.have.length( 37 );

		for ( const name in styles ) {
			expect( styles[ name ] ).to.be.a( 'function' );
		}
	} );

	it( 'work in bash', () => {
		expect( styles.red( 'foo' ) ).to.equal( '\\[\u001b[31m\\]foo\\[\u001b[39m\\]' );
	} );

	it( 'work in fish', () => {
		const stub = sinon.stub( process, 'env' ).value( { 'SHELL': 'foo/fish' } );
		const styles = require( '../lib/styles.js' )();

		expect( styles.red( 'foo' ) ).to.equal( '\u001b[31mfoo\u001b[39m' );

		stub.restore();
	} );
} );
