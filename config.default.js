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
		const chunks = [];

		function addText( segment, ...styleNames ) {
			for ( const styleName of styleNames ) {
				segment = styles[ styleName ]( segment );
			}

			return segment;
		}

		function addChunk( callback, bgColor ) {
			const textParts = callback();
			let text = '';

			for ( const [ ...partArgs ] of textParts ) {
				text += addText( ...partArgs );
			}

			chunks.push( {
				// Finally wrap all the chunk in the background style.
				text: addText( text, bg( bgColor ) ),
				bgColor
			} );
		}

		// User name and host.
		addChunk( () => [
			[ ` ${model.username}`, fg( 'white' ), 'bold' ],
			[ '@' + model.hostname + ' ', fg( 'lightGray' ) ]
		], 'blue' );

		// CWD
		addChunk( () => {
			const parts = [];

			if ( model.path[ 0 ] !== '~' ) {
				parts.push( [ '/', fg( 'darkGray' ) ] );
			}

			model.path.forEach( ( segment, index ) => {
				if ( index !== model.path.length - 1 ) {
					parts.push( [ segment + '/', fg( 'darkGray' ) ] );
				} else {
					parts.push( [ segment, fg( 'black' ), 'bold' ] );
				}
			} );

			parts.push( [ ' ' ] );

			return parts;
		}, 'lightGray' );

		// GIT
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

			// Diverged/Ahead/Behind + Hash
			addChunk( () => {
				const parts = [];

				if ( model.hasDiverged ) {
					parts.push( [ '↕ ', 'bold', fg( 'black' ) ] );
				} else if ( model.ahead ) {
					parts.push( [ '↑ ', 'bold', fg( 'black' ) ] );
				} else if ( model.behind ) {
					parts.push( [ '↓ ', 'bold', fg( 'black' ) ] );
				}

				// Standard style if in an empty (just initialized) repo.
				if ( model.isInit ) {
					parts.push( [ 'init', fg( 'black' ) ] );
				} else if ( model.isDetached ) {
					parts.push( [ `detached:${ model.namerev }`, fg( 'black' ), 'bold' ] );
				} else if ( model.isMerging ) {
					parts.push( [ `merge:${ model.namerev }←${ model.mergeHead }`, fg( 'black' ), 'bold' ] );
				} else {
					parts.push(
						[ ' ', fg( 'black' ) ],
						[ model.branch, fg( 'black' ), 'bold' ]
					);
				}

				// No hash to be displayed if just initialized.
				if ( !model.isInit ) {
					parts.push(
						[ ' (' + model.hash + ')', fg( 'black' ) ]
					);
				}

				parts.push( [ ' ' ] );

				return parts;
			}, statusColor );

			if ( model.added ) {
				addChunk( () => [
					[ `+${ model.added } `, fg( 'black' ) ],
				], 'green' );
			}

			if ( model.modified ) {
				addChunk( () => [
					[ `M${ model.modified } `, 'black' ],
				], 'red' );
			}

			if ( model.untracked ) {
				addChunk( () => [
					[ `?${ model.untracked } `, 'black' ],
				], 'lightBlue' );
			}
		}

		let lastChunkBgColor;

		return chunks
			.reverse()
			.reduce( ( accumulator, chunk ) => {
				const symbolStyles = [
					fg( chunk.bgColor )
				];

				if ( lastChunkBgColor ) {
					symbolStyles.push( bg( lastChunkBgColor ) );
				}

				lastChunkBgColor = chunk.bgColor;

				return chunk.text + addText( ' ', ...symbolStyles ) + accumulator;
			}, '' );
	}
};

function fg( color ) {
	return color;
}

function bg( color ) {
	return `bg${ color.charAt( 0 ).toUpperCase() + color.substring( 1 ) }`;
}
