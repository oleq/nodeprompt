/**
 * A default styles set for the prompt.
 *
 * @license MIT
 */

/* global process */

'use strict';

const styles = {
	// Font styles.
	bold: 			[ 1, 22 ],
	italic: 		[ 3, 23 ],
	underline: 		[ 4, 24 ],
	inverse: 		[ 7, 27 ],
	strikeThrough: 	[ 9, 29 ],

	// Text colors.
	black: 			[ 30, 39 ],
	red: 			[ 31, 39 ],
	green: 			[ 32, 39 ],
	yellow: 		[ 33, 39 ],
	blue: 			[ 34, 39 ],
	magenta: 		[ 35, 39 ],
	cyan: 			[ 36, 39 ],
	lightGray: 		[ 37, 39 ],
	darkGray: 		[ 90, 39 ],
	lightRed: 		[ 91, 39 ],
	lightGreen: 	[ 92, 39 ],
	lightYellow: 	[ 93, 39 ],
	lightBlue: 		[ 94, 39 ],
	lightMagenta: 	[ 95, 39 ],
	lightCyan: 		[ 96, 39 ],
	white: 			[ 97, 39 ],

	// Background colors.
	bgBlack: 		[ 40, 49 ],
	bgRed: 			[ 41, 49 ],
	bgGreen: 		[ 42, 49 ],
	bgYellow: 		[ 43, 49 ],
	bgBlue: 		[ 44, 49 ],
	bgMagenta: 		[ 45, 49 ],
	bgCyan: 		[ 46, 49 ],
	bgLightGray: 	[ 47, 49 ],
	bgDarkGray: 	[ 100, 49 ],
	bgLightRed: 	[ 101, 49 ],
	bgLightGreen: 	[ 102, 49 ],
	bgLightYellow: 	[ 103, 49 ],
	bgLightBlue: 	[ 104, 49 ],
	bgLightMagenta:	[ 105, 49 ],
	bgLightCyan: 	[ 106, 49 ],
	bgWhite: 		[ 107, 49 ]
};

module.exports = ( passThru ) => {
	const styleFunctions = {};

	if ( passThru ) {
		for ( const name in styles ) {
			styleFunctions[ name ] = text => text;
		}
	} else {
		const shellName = process.env.SHELL.split( '/' ).pop();
		let seq;

		switch ( shellName ) {
			case 'bash':
				seq = [ '\\[\u001b[', 'm\\]' ];
				break;
			case 'zsh':
				seq = [ '%{\u001b[', 'm%}' ];
				break;
			default:
				seq = [ '\u001b[', 'm' ];
		}

		for ( const name in styles ) {
			const open = `${ seq[ 0 ] }${ styles[ name ][ 0 ] }${ seq[ 1 ] }`;
			const close = `${ seq[ 0 ] }${ styles[ name ][ 1 ] }${ seq[ 1 ] }`;

			styleFunctions[ name ] = text => `${ open }${ text }${ close }`;
		}
	}

	return styleFunctions;
};
