/**
 * A default configuration of the nodeprompt.
 *
 * @license MIT
 */

'use strict';

/**
 * NOTE: This is a default Nodeprompt config. Do not modify it unless you like surprises.
 *       Create a `~/.nodeprompt/config.user.js` file with the same structure and
 *       your config values instead.
 */
module.exports = {
	/**
	 * Length of commit SHA-1 hash displayed in the prompt.
	 *
	 * @cfg {Number} [hashLength=7]
	 */
	hashLength: 7,

	/**
	 * Number of items to be displayed in the path. If the length of
	 * PWD is greater than this value, the path will be truncated.
	 *
	 * For instance, if `PWD` is `/first/second/third/fourth` and `pathLength` is 2,
	 * the path will be:
	 *
	 * 	~/...third/fourth>
	 *
	 * @cfg {Number} [pathLength=2]
	 */
	pathLength: 2,

	/**
	 * Template (V-layer :P) of the prompt. A function, which converts status model into
	 * a nice, colorful prompt string. You can take control of the look and feel of your
	 * bash prompt by creating your own `template` function.
	 *
	 * @cfg {Function} template
	 * @param {Object} model Status model object, which consists of the following items:
	 *
	 * Environmental/general repository info:
	 *  * `pwd`
	 *  * `home`
	 *  * `gitDir`
	 *  * `hostname`
	 *  * `username`
	 *  * `path`
	 *  * `namerev`
	 *  * `head`
	 *  * `hash`
	 *  * `mergeHead`
	 *
	 * Booleans:
	 *  * `isGit`
	 *  * `isInit`
	 *  * `isBisecting`
	 *  * `isDetached`
	 *  * `isMerging`
	 *
	 * Status specific:
	 *  * `modified`
	 *  * `added`
	 *  * `untracked`
	 *  * `ahead`
	 *  * `behind`
	 *  * `branch`
	 *  * `hasDiverged`
	 *
	 * Powerline symbols: `      ☰ `
	 *
	 * @param {Object} style An object consisting of a number of functions, all of which accept and return
	 * `String`, dedicated to change style, background or text color. See `styles.js` to know more.
	 */
	template( model, styles ) {
		let text = '';

		function addText( segment, ...styleNames ) {
			for ( const styleName of styleNames ) {
				segment = styles[ styleName ]( segment );
			}

			text += segment;
		}

		function fg( color ) {
			return color;
		}

		function bg( color ) {
			return `bg${ color.charAt( 0 ).toUpperCase() + color.substring( 1 ) }`;
		}

		addText( ' ', fg( 'white' ), bg( 'blue' ) );
		addText( model.username, fg( 'white' ), bg( 'blue' ), 'bold' );
		addText( '@' + model.hostname + ' ', fg( 'lightGray' ), bg( 'blue' ) );
		addText( ' ', fg( 'blue' ), bg( 'lightGray' ) );

		if ( model.path[ 0 ] !== '~' ) {
			addText( '/', fg( 'darkGray' ), bg( 'lightGray' ) );
		}

		model.path.forEach( ( segment, index ) => {
			if ( index !== model.path.length - 1 ) {
				addText( segment + '/', fg( 'darkGray' ), bg( 'lightGray' ) );
			} else {
				addText( segment, fg( 'black' ), bg( 'lightGray' ), 'bold' );
			}
		} );

		addText( ' ', bg( 'lightGray' ) );

		if ( model.isGit ) {
			let statusColor;

			if ( model.isMerging ) {
				statusColor = 'lightMagenta';
			} else if ( model.isDetached ) {
				statusColor = 'lightRed';
			} else if ( model.hasDiverged || model.ahead || model.behind ) {
				statusColor = 'lightYellow';
			} else {
				statusColor = 'white';
			}

			let statusBgColor = bg( statusColor );

			if ( model.hasDiverged || model.ahead || model.behind ) {
				addText( ' ', bg( 'lightYellow' ), 'lightGray' );
			}

			if ( model.hasDiverged ) {
				addText( '↕ ', bg( 'lightYellow' ), 'bold', fg( 'black' ) );
			} else {
				if ( model.ahead ) {
					addText( '↑ ', bg( 'lightYellow' ), 'bold', fg( 'black' ) );
				} else if ( model.behind ) {
					addText( '↓ ', bg( 'lightYellow' ), 'bold', fg( 'black' ) );
				} else {
					addText( ' ', statusBgColor, fg( 'lightGray' ) );
				}
			}

			let lastColor = statusColor;

			// Standard style if in an empty (just initialized) repo.
			if ( model.isInit ) {
				addText( 'init', statusBgColor, fg( 'black' ) );
			} else if ( model.isDetached ) {
				addText( `detached:${ model.namerev }`, statusBgColor, fg( 'black' ), 'bold' );
			} else if ( model.isMerging ) {
				addText( `merge:${ model.namerev }←${ model.mergeHead }`, statusBgColor, fg( 'black' ), 'bold' );
			} else {
				addText( ' ', statusBgColor, fg( 'black' ) );
				addText( model.branch , statusBgColor, fg( 'black' ), 'bold' );
			}

			// No hash to be displayed if just initialized.
			if ( !model.isInit ) {
				addText( ' ', statusBgColor, fg( 'black' ) );
				addText( '(' + model.hash + ')', statusBgColor, fg( 'black' ) );
				lastColor = statusColor;
			}

			if ( model.added ) {
				addText( ' ', fg( lastColor ), bg( lastColor ) );
				addText( '', fg( lastColor ), bg( 'green' ) );
				addText( ' ', bg( 'green' ) );
				addText( `+${ model.added }`, bg( 'green' ), 'black' );

				lastColor = 'green';
			}

			if ( model.modified ) {
				addText( ' ', fg( lastColor ), bg( lastColor ) );
				addText( '', fg( lastColor ), bg( 'red' ) );
				addText( ' ', bg( 'red' ) );
				addText( `M${ model.modified }`, bg( 'red' ), 'black' );

				lastColor = 'red';
			}

			if ( model.untracked ) {
				addText( ' ', fg( lastColor ), bg( lastColor ) );
				addText( '', fg( lastColor ), bg( 'lightBlue' ) );
				addText( ' ', bg( 'lightBlue' ) );
				addText( `?${ model.untracked }`, bg( 'lightBlue' ), 'black' );

				lastColor = 'lightBlue';
			}

			addText( ' ', fg( lastColor ), bg( lastColor ) );
			addText( '', fg( lastColor ), bg( 'black' ) );
		} else {
			addText( '', 'lightGray' );
		}

		return text + ' ';
	}
};
