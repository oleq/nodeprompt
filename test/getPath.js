'use strict';

const config = NODEPROMPT.config = NODEPROMPT.configDefault;
const getPath = NODEPROMPT.getPath;

describe( 'getPath', () => {
	it( 'returns path with default config (out of home)', () => {
		testGetPath( '/', 						'/x', 				'/' );
		testGetPath( '/a', 						'/x', 				'/a' );
		testGetPath( '/a/b', 					'/x', 				'/a/b' );
		testGetPath( '/a/b/c', 					'/x', 				'/a/b/c' );
		testGetPath( '/a/b/c/d', 				'/x', 				'/...b/c/d' );
		testGetPath( '/a/b/c/d/e',	 			'/x', 				'/...c/d/e' );
		testGetPath( '/a/b/c/d/e/f/',			'/x', 				'/...d/e/f' );

		testGetPath( '/a/x/c', 					'/x', 				'/a/x/c' );
		testGetPath( '/a/x/y/c', 				'/x/y', 			'/...x/y/c' );
	} );

	it( 'returns path with default config (in home)', () => {
		testGetPath( '/', 						'/a/b', 			'/' );
		testGetPath( '/a', 						'/a/b', 			'/a' );
		testGetPath( '/a/b', 					'/a/b', 			'~' );
		testGetPath( '/a/b/c', 					'/a/b', 			'~/c' );
		testGetPath( '/a/b/c/d', 				'/a/b', 			'~/c/d' );
		testGetPath( '/a/b/c/d/e',	 			'/a/b', 			'~/c/d/e' );
		testGetPath( '/a/b/c/d/e/f/',			'/a/b', 			'~/...d/e/f' );
		testGetPath( '/a/b/c/d/e/f/g',			'/a/b', 			'~/...e/f/g' );
	} );

	it( 'returns path with custom config', () => {
		const defaultPathLength = config.pathLength;

		config.pathLength = 1;
		testGetPath( '/', 						'/x',	 			'/' );
		testGetPath( '/a', 						'/x', 				'/a' );
		testGetPath( '/a/b', 					'/x', 				'/...b' );
		testGetPath( '/a/b/c', 					'/x', 				'/...c' );

		testGetPath( '/a', 						'/a', 				'~' );
		testGetPath( '/a/b', 					'/a', 				'~/b' );
		testGetPath( '/a/b/c', 					'/a', 				'~/...c' );

		config.pathLength = 5;
		testGetPath( '/a/b/c/d/e/f/g', 			'/x', 				'/...c/d/e/f/g' );
		testGetPath( '/a/b/c/d/e/f/g/h', 		'/a/b', 			'~/...d/e/f/g/h' );

		config.pathLength = defaultPathLength;
	} );
} );

function testGetPath( path, home, expected ) {
	const data = {};

	getPath.call( NODEPROMPT, data, path, home );
	expect( data.path ).to.be.equal( expected );
}