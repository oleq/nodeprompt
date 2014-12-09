'use strict';

module.exports = function( colorful ) {
	var styles = {
		// Font styles.
		bold: 			[ '\\033[1m', '\\033[22m' ],
		italic: 		[ '\\033[3m', '\\033[23m' ],
		underline: 		[ '\\033[4m', '\\033[24m' ],
		inverse: 		[ '\\033[7m', '\\033[27m' ],
		strikeThrough: 	[ '\\033[9m', '\\033[29m' ],

		// Text colors.
		black: 			[ '\\033[30m', '\\033[39m' ],
		red: 			[ '\\033[31m', '\\033[39m' ],
		green: 			[ '\\033[32m', '\\033[39m' ],
		yellow: 		[ '\\033[33m', '\\033[39m' ],
		blue: 			[ '\\033[34m', '\\033[39m' ],
		magenta: 		[ '\\033[35m', '\\033[39m' ],
		cyan: 			[ '\\033[36m', '\\033[39m' ],
		lightGray: 		[ '\\033[37m', '\\033[39m' ],
		darkGray: 		[ '\\033[90m', '\\033[39m' ],
		lightRed: 		[ '\\033[91m', '\\033[39m' ],
		lightGreen: 	[ '\\033[92m', '\\033[39m' ],
		lightYellow: 	[ '\\033[93m', '\\033[39m' ],
		lightBlue: 		[ '\\033[94m', '\\033[39m' ],
		lightMagenta: 	[ '\\033[95m', '\\033[39m' ],
		lightCyan: 		[ '\\033[96m', '\\033[39m' ],
		white: 			[ '\\033[97m', '\\033[39m' ],

		// Background colors.
		bgBlack: 		[ '\\033[40m', '\\033[49m' ],
		bgRed: 			[ '\\033[41m', '\\033[49m' ],
		bgGreen: 		[ '\\033[42m', '\\033[49m' ],
		bgYellow: 		[ '\\033[43m', '\\033[49m' ],
		bgBlue: 		[ '\\033[44m', '\\033[49m' ],
		bgMagenta: 		[ '\\033[45m', '\\033[49m' ],
		bgCyan: 		[ '\\033[46m', '\\033[49m' ],
		bgLightGray: 	[ '\\033[47m', '\\033[49m' ],
		bgDarkGray: 	[ '\\033[100m', '\\033[49m' ],
		bgLightRed: 	[ '\\033[101m', '\\033[49m' ],
		bgLightGreen: 	[ '\\033[102m', '\\033[49m' ],
		bgLightYellow: 	[ '\\033[103m', '\\033[49m' ],
		bgLightBlue: 	[ '\\033[104m', '\\033[49m' ],
		bgLightMagenta: [ '\\033[105m', '\\033[49m' ],
		bgLightCyan: 	[ '\\033[106m', '\\033[49m' ],
		bgWhite: 		[ '\\033[107m', '\\033[49m' ]

	};

	for ( var s in styles ) {
		( function() {
			var open = styles[ s ][ 0 ],
				close = styles[ s ][ 1 ];

			styles[ s ] =
				colorful ?
					function( text ) { return open + text + close; }
				:
					function( text ) { return text; };
		} )();
	}

	return styles;
};