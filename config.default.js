/**
 * A default configuration of the prompt.
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
	 * PWD is greater than this value, path is truncated, i.e.
	 *
	 * If PWD is `/first/second/third/fourth` and `pathLength` is 2,
	 * path gets truncated:
	 *
	 * 	~/...third/fourth>
	 *
	 * @cfg {Number} [pathLength=3]
	 */
	pathLength: 3,

	/**
	 * The last character of the prompt.
	 *
	 * @cfg {String} [promptChar=">"]
	 */
	promptChar: '>',

	/**
	 * Template (V-layer :P) of the prompt. A function, which converts status model into
	 * a nice, colourful prompt string. You can take control of the look and feel of your
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
	 * @param {Object} style An object consisting of a number of functions, all of which accept and return
	 * `String`, dedicated to change style, background or text color. See `styles.js` to know more.
	 */
	template( model, styles ) {
		let text = '';

		if ( model.isGit ) {
			const statusStyle =
				model.isMerging ? styles.lightMagenta :
					model.isDetached ? styles.red :
						model.modified ? styles.red :
							model.added ? styles.lightGreen :
								model.untracked ? styles.lightBlue :
									styles.darkGray;

			text += statusStyle( '(' );

			// Standard style if inited.
			if ( model.isInit ) {
				text += 'init';
			} else if ( model.isDetached ) {
				text += statusStyle( `detached:${ model.namerev }` );
			} else if ( model.isMerging ) {
				text += statusStyle( `merge:${ model.namerev }<--${ model.mergeHead }` );
			} else {
				text += statusStyle( model.branch );
			}

			if ( model.hasDiverged ) {
				text += styles.bold( styles.lightYellow( '↕' ) );
			} else {
				if ( model.ahead ) {
					text += styles.bold( styles.lightYellow( '↑' ) );
				} else if ( model.behind ) {
					text += styles.bold( styles.lightYellow( '↓' ) );
				}
			}

			// No hash to be displayed if just inited.
			if ( !model.isInit ) {
				text += ' ' + styles.bold( styles.darkGray( model.hash ) );
			}

			if ( model.added ) {
				text += styles.lightGreen( ` +${ model.added }` );
			}

			if ( model.modified ) {
				text += styles.red( ` M${ model.modified }` );
			}

			if ( model.untracked ) {
				text += styles.lightBlue( ` ?${ model.untracked }` );
			}

			text += statusStyle( ') ' );
		}

		text += styles.lightGreen( `${ model.username }@${ model.hostname }` );
		text += ' ' + styles.lightCyan( `${ model.path }${ this.promptChar } ` );

		return text;
	}
};