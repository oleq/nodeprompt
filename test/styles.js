/**
 * @license MIT
 */

/* global process */

'use strict';

describe( 'styles', () => {
	let sandbox, styles;

	beforeEach( () => {
		styles = require( '../lib/styles.js' )();
		sandbox = sinon.sandbox.create();
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	it( 'are defined as functions', () => {
		expect( styles ).to.be.an( 'object' );
		expect( Object.keys( styles ) ).to.have.length( 37 );

		for ( const name in styles ) {
			expect( styles[ name ] ).to.be.a( 'function' );
		}
	} );

	it( 'work in bash/zsh', () => {
		sandbox.stub( process, 'env' ).value( { 'SHELL': 'bin/bash' } );

		const styles = require( '../lib/styles.js' )();

		expect( styles.red( 'foo' ) ).to.equal( '\\[\u001b[31m\\]foo\\[\u001b[39m\\]' );
	} );

	it( 'work in fish', () => {
		sandbox.stub( process, 'env' ).value( { 'SHELL': 'bin/fish' } );

		const styles = require( '../lib/styles.js' )();

		expect( styles.red( 'foo' ) ).to.equal( '\u001b[31mfoo\u001b[39m' );
	} );
} );
