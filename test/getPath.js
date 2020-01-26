/**
 * @license MIT
 */

'use strict';

const Nodeprompt = require( '../lib/nodeprompt.js' );

let nodeprompt;

describe( '_getPath()', () => {
	beforeEach( () => {
		nodeprompt = new Nodeprompt();
	} );

	//        PWD                       HOME                EXPECTED
	it( 'returns path with default config (out of home)', () => {
		test( 'a', 						'/x', 				[ 'a' ] );
		test( '/', 						'/x', 				[] );
		test( '/a', 					'/x', 				[ 'a' ] );
		test( '/a/b', 					'/x', 				[ 'a' , 'b' ] );
		test( '/a/b/c', 				'/x', 				[ '...', 'b', 'c' ] );
		test( '/a/b/c/d', 				'/x', 				[ '...', 'c', 'd' ] );
		test( '/a/b/c/d/e',	 			'/x', 				[ '...', 'd', 'e' ] );
		test( '/a/b/c/d/e/f/',			'/x', 				[ '...', 'e','f' ] );
		test( '/a/x/c', 				'/x', 				[ '...', 'x', 'c' ] );
		test( '/a/x/y/c', 				'/x/y', 			[ '...', 'y', 'c' ] );
	} );

	it( 'returns path with default config (in home)', () => {
		test( '/', 						'/a/b', 			[] );
		test( '/a', 					'/a/b', 			[ 'a' ] );
		test( '/a/b', 					'/a/b', 			[ '~' ] );
		test( '/a/b/c', 				'/a/b', 			[ '~', 'c' ] );
		test( '/a/b/c/d', 				'/a/b', 			[ '~', 'c', 'd' ] );
		test( '/a/b/c/d/e',	 			'/a/b', 			[ '~', '...', 'd', 'e' ] );
		test( '/a/b/c/d/e/f/',			'/a/b', 			[ '~', '...', 'e', 'f' ] );
		test( '/a/b/c/d/e/f/g',			'/a/b', 			[ '~', '...', 'f', 'g' ] );
	} );

	it( 'returns path with custom config', () => {
		const defaultPathLength = nodeprompt.config.pathLength;

		nodeprompt.config.pathLength = 1;
		test( '/', 						'/x',	 			[] );
		test( '/a', 					'/x', 				[ 'a' ] );
		test( '/a/b', 					'/x', 				[ '...', 'b' ] );
		test( '/a/b/c', 				'/x', 				[ '...', 'c' ] );

		test( '/a', 					'/a', 				[ '~' ] );
		test( '/a/b', 					'/a', 				[ '~', 'b' ] );
		test( '/a/b/c', 				'/a', 				[ '~', '...', 'c' ] );

		nodeprompt.config.pathLength = 5;
		test( '/a/b/c/d/e/f/g', 		'/x', 				[ '...', 'c', 'd' ,'e' ,'f', 'g' ] );
		test( '/a/b/c/d/e/f/g/h', 		'/a/b', 			[ '~', '...', 'd', 'e', 'f', 'g', 'h' ] );

		nodeprompt.config.pathLength = defaultPathLength;
	} );
} );

function test( pwd, home, expected ) {
	expect( nodeprompt._getPath( { pwd, home } ) ).to.have.ordered.members( expected );
}
