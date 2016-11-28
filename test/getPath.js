/**
 * @license Copyright (c) 2003-2016, Aleksander Nowodziński. All rights reserved.
 */
'use strict';

const Nodeprompt = require( '../lib/nodeprompt.js' );

let nodeprompt;

describe( '_getPath()', () => {
	beforeEach( () => {
		nodeprompt = new Nodeprompt();
	} );

	it( 'returns path with default config (out of home)', () => {
		test( '/', 						'/x', 				'/' );
		test( '/a', 					'/x', 				'/a' );
		test( '/a/b', 					'/x', 				'/a/b' );
		test( '/a/b/c', 				'/x', 				'/a/b/c' );
		test( '/a/b/c/d', 				'/x', 				'/...b/c/d' );
		test( '/a/b/c/d/e',	 			'/x', 				'/...c/d/e' );
		test( '/a/b/c/d/e/f/',			'/x', 				'/...d/e/f' );

		test( '/a/x/c', 				'/x', 				'/a/x/c' );
		test( '/a/x/y/c', 				'/x/y', 			'/...x/y/c' );
	} );

	it( 'returns path with default config (in home)', () => {
		test( '/', 						'/a/b', 			'/' );
		test( '/a', 					'/a/b', 			'/a' );
		test( '/a/b', 					'/a/b', 			'~' );
		test( '/a/b/c', 				'/a/b', 			'~/c' );
		test( '/a/b/c/d', 				'/a/b', 			'~/c/d' );
		test( '/a/b/c/d/e',	 			'/a/b', 			'~/c/d/e' );
		test( '/a/b/c/d/e/f/',			'/a/b', 			'~/...d/e/f' );
		test( '/a/b/c/d/e/f/g',			'/a/b', 			'~/...e/f/g' );
	} );

	it( 'returns path with custom config', () => {
		const defaultPathLength = nodeprompt.config.pathLength;

		nodeprompt.config.pathLength = 1;
		test( '/', 						'/x',	 			'/' );
		test( '/a', 					'/x', 				'/a' );
		test( '/a/b', 					'/x', 				'/...b' );
		test( '/a/b/c', 				'/x', 				'/...c' );

		test( '/a', 					'/a', 				'~' );
		test( '/a/b', 					'/a', 				'~/b' );
		test( '/a/b/c', 				'/a', 				'~/...c' );

		nodeprompt.config.pathLength = 5;
		test( '/a/b/c/d/e/f/g', 		'/x', 				'/...c/d/e/f/g' );
		test( '/a/b/c/d/e/f/g/h', 		'/a/b', 			'~/...d/e/f/g/h' );

		nodeprompt.config.pathLength = defaultPathLength;
	} );
} );

function test( pwd, home, expected ) {
	expect( nodeprompt._getPath( { pwd, home } ) ).to.equal( expected );
}