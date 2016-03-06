'use strict';

const styles = {
	// Font styles.
	bold: 			[ '1m\\]', '[22m' ],
	italic: 		[ '3m\\]', '[23m' ],
	underline: 		[ '4m\\]', '[24m' ],
	inverse: 		[ '7m\\]', '[27m' ],
	strikeThrough: 	[ '9m\\]', '[29m' ],

	// Text colors.
	black: 			[ '30m\\]', '[39m' ],
	red: 			[ '31m\\]', '[39m' ],
	green: 			[ '32m\\]', '[39m' ],
	yellow: 		[ '33m\\]', '[39m' ],
	blue: 			[ '34m\\]', '[39m' ],
	magenta: 		[ '35m\\]', '[39m' ],
	cyan: 			[ '36m\\]', '[39m' ],
	lightGray: 		[ '37m\\]', '[39m' ],
	darkGray: 		[ '90m\\]', '[39m' ],
	lightRed: 		[ '91m\\]', '[39m' ],
	lightGreen: 	[ '92m\\]', '[39m' ],
	lightYellow: 	[ '93m\\]', '[39m' ],
	lightBlue: 		[ '94m\\]', '[39m' ],
	lightMagenta: 	[ '95m\\]', '[39m' ],
	lightCyan: 		[ '96m\\]', '[39m' ],
	white: 			[ '97m\\]', '[39m' ],

	// Background colors.
	bgBlack: 		[ '40m\\]', '49' ],
	bgRed: 			[ '41m\\]', '49' ],
	bgGreen: 		[ '42m\\]', '49' ],
	bgYellow: 		[ '43m\\]', '49' ],
	bgBlue: 		[ '44m\\]', '49' ],
	bgMagenta: 		[ '45m\\]', '49' ],
	bgCyan: 		[ '46m\\]', '49' ],
	bgLightGray: 	[ '47m\\]', '49' ],
	bgDarkGray: 	[ '10m\\]0', '49' ],
	bgLightRed: 	[ '10m\\]1', '49' ],
	bgLightGreen: 	[ '10m\\]2', '49' ],
	bgLightYellow: 	[ '10m\\]3', '49' ],
	bgLightBlue: 	[ '10m\\]4', '49' ],
	bgLightMagenta:	[ '10m\\]5', '49' ],
	bgLightCyan: 	[ '10m\\]6', '49' ],
	bgWhite: 		[ '10m\\]7', '49' ]
};

module.exports = ( raw ) => {
	if ( raw ) {
		for ( let name in styles ) {
			styles[ name ] = text => text;
		}
	} else {
		for ( let name in styles ) {
			const open = styles[ name ][ 0 ];
			const close = styles[ name ][ 1 ];

			styles[ name ] = text => `\\[\x1b[${open}\\]${text}\\[\x1b${close}\\]`;
		}
	}

	return styles;
};