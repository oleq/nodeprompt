'use strict';

module.exports = function( colorful ) {
	var styles = {
		// Font styles.
		bold: 			[ '\\[\x1b[1m\\]', '\\[\x1b[22m\\]' ],
		italic: 		[ '\\[\x1b[3m\\]', '\\[\x1b[23m\\]' ],
		underline: 		[ '\\[\x1b[4m\\]', '\\[\x1b[24m\\]' ],
		inverse: 		[ '\\[\x1b[7m\\]', '\\[\x1b[27m\\]' ],
		strikeThrough: 	[ '\\[\x1b[9m\\]', '\\[\x1b[29m\\]' ],

		// Text colors.
		black: 			[ '\\[\x1b[30m\\]', '\\[\x1b[39m\\]' ],
		red: 			[ '\\[\x1b[31m\\]', '\\[\x1b[39m\\]' ],
		green: 			[ '\\[\x1b[32m\\]', '\\[\x1b[39m\\]' ],
		yellow: 		[ '\\[\x1b[33m\\]', '\\[\x1b[39m\\]' ],
		blue: 			[ '\\[\x1b[34m\\]', '\\[\x1b[39m\\]' ],
		magenta: 		[ '\\[\x1b[35m\\]', '\\[\x1b[39m\\]' ],
		cyan: 			[ '\\[\x1b[36m\\]', '\\[\x1b[39m\\]' ],
		lightGray: 		[ '\\[\x1b[37m\\]', '\\[\x1b[39m\\]' ],
		darkGray: 		[ '\\[\x1b[90m\\]', '\\[\x1b[39m\\]' ],
		lightRed: 		[ '\\[\x1b[91m\\]', '\\[\x1b[39m\\]' ],
		lightGreen: 	[ '\\[\x1b[92m\\]', '\\[\x1b[39m\\]' ],
		lightYellow: 	[ '\\[\x1b[93m\\]', '\\[\x1b[39m\\]' ],
		lightBlue: 		[ '\\[\x1b[94m\\]', '\\[\x1b[39m\\]' ],
		lightMagenta: 	[ '\\[\x1b[95m\\]', '\\[\x1b[39m\\]' ],
		lightCyan: 		[ '\\[\x1b[96m\\]', '\\[\x1b[39m\\]' ],
		white: 			[ '\\[\x1b[97m\\]', '\\[\x1b[39m\\]' ],

		// Background colors.
		bgBlack: 		[ '\\[\x1b[40m\\]', '\\[\x1b49\\]' ],
		bgRed: 			[ '\\[\x1b[41m\\]', '\\[\x1b49\\]' ],
		bgGreen: 		[ '\\[\x1b[42m\\]', '\\[\x1b49\\]' ],
		bgYellow: 		[ '\\[\x1b[43m\\]', '\\[\x1b49\\]' ],
		bgBlue: 		[ '\\[\x1b[44m\\]', '\\[\x1b49\\]' ],
		bgMagenta: 		[ '\\[\x1b[45m\\]', '\\[\x1b49\\]' ],
		bgCyan: 		[ '\\[\x1b[46m\\]', '\\[\x1b49\\]' ],
		bgLightGray: 	[ '\\[\x1b[47m\\]', '\\[\x1b49\\]' ],
		bgDarkGray: 	[ '\\[\x1b[10m\\]0', '\\[\x1b49\\]' ],
		bgLightRed: 	[ '\\[\x1b[10m\\]1', '\\[\x1b49\\]' ],
		bgLightGreen: 	[ '\\[\x1b[10m\\]2', '\\[\x1b49\\]' ],
		bgLightYellow: 	[ '\\[\x1b[10m\\]3', '\\[\x1b49\\]' ],
		bgLightBlue: 	[ '\\[\x1b[10m\\]4', '\\[\x1b49\\]' ],
		bgLightMagenta:	[ '\\[\x1b[10m\\]5', '\\[\x1b49\\]' ],
		bgLightCyan: 	[ '\\[\x1b[10m\\]6', '\\[\x1b49\\]' ],
		bgWhite: 		[ '\\[\x1b[10m\\]7', '\\[\x1b49\\]' ]
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