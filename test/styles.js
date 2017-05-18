/**
 * @license MIT
 */

'use strict';

const styles = require( '../lib/styles.js' )();

describe( 'styles', () => {
	it( 'work', () => {
		for ( let name in styles ) {
			console.log( `---${ styles[ name ]( name ) }---` );
			process.stdout.write( styles[ name ]( name ) );
			process.stdout.write( '\n' );
		}
	} );
} );