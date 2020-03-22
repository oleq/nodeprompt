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
		const promptSegments = [];

		// It styles the provided textContent using arbitrary text styles.
		//
		//		text( 'some text', 'red', bg( 'black' ), 'bold' ); // -> <bold><bgBlack><red>some text</red></bgBlack></bold>
		//
		function text( textContent, ...styleNames ) {
			for ( const styleName of styleNames ) {
				textContent = styles[ styleName ]( textContent );
			}

			return textContent;
		}

		// Creates a segment ("segment ") of the prompt with a background color.
		//
		//		addSegment( () => [
		//			[ 'foo', 'white', 'bold' ],
		//			[ 'bar', 'lightGray' ]
		//		], 'blue' );
		//
		// creates the following text in the prompt
		//
		//		<bgBlue>
		//			<bold><white>foo</white></bold>
		//			<lightGray>foo</lightGray>
		//		</bgBlue>
		//
		function addSegment( getParts, bgColor ) {
			const textParts = getParts();
			let segmentText = '';

			for ( const textPart of textParts ) {
				segmentText += text( ...textPart );
			}

			// Wrap all the parts in the background color style.
			promptSegments.push( {
				text: text( segmentText, bg( bgColor ) ),
				bgColor
			} );
		}

		// User name and host.
		getUserAndHostSegment( addSegment, model );

		// Current working directory path.
		getCwdSegment( addSegment, model, styles );

		// GIT
		if ( model.isGit ) {
			// Diverged/Ahead/Behind, Init/Detached/Merging/Branch+Hash.
			addGitBranchSegment( addSegment, model );

			// Added/Modified/Untracked.
			addGitStageSegment( addSegment, model );
		}

		let lastSegmentBgColor;

		return promptSegments
			.reverse()
			.reduce( ( accumulator, segment ) => {
				const symbolStyles = [ segment.bgColor ];

				if ( lastSegmentBgColor ) {
					symbolStyles.push( bg( lastSegmentBgColor ) );
				}

				lastSegmentBgColor = segment.bgColor;

				return segment.text + text( ' ', ...symbolStyles ) + accumulator;
			}, '' );
	}
};

function getUserAndHostSegment( addSegment, model ) {
	addSegment( () => [
		[ ` ${model.username}`, 'white', 'bold' ],
		[ '@' + model.hostname + ' ', 'lightGray' ]
	], 'blue' );
}

function getCwdSegment( addSegment, model ) {
	addSegment( () => {
		const parts = [];

		if ( model.path[ 0 ] !== '~' ) {
			parts.push( [ '/', 'darkGray' ] );
		}

		model.path.forEach( ( segment, index ) => {
			if ( index !== model.path.length - 1 ) {
				parts.push( [ segment + '/', 'darkGray' ] );
			} else {
				parts.push( [ segment, 'black', 'bold' ] );
			}
		} );

		parts.push( [ ' ' ] );

		return parts;
	}, 'lightGray' );
}

function addGitBranchSegment( addSegment, model ) {
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

	addSegment( () => {
		const parts = [];

		if ( model.hasDiverged ) {
			parts.push( [ '↕ ', 'bold', 'black' ] );
		} else if ( model.ahead ) {
			parts.push( [ '↑ ', 'bold', 'black' ] );
		} else if ( model.behind ) {
			parts.push( [ '↓ ', 'bold', 'black' ] );
		}

		// Standard style if in an empty (just initialized) repo.
		if ( model.isInit ) {
			parts.push( [ 'init', 'black' ] );
		} else if ( model.isDetached ) {
			parts.push( [ `detached:${ model.namerev }`, 'black', 'bold' ] );
		} else if ( model.isMerging ) {
			parts.push( [ `merge:${ model.namerev }←${ model.mergeHead }`, 'black', 'bold' ] );
		} else {
			parts.push(
				[ ' ', 'black' ],
				[ model.branch, 'black', 'bold' ]
			);
		}

		// No hash to be displayed if just initialized.
		if ( !model.isInit ) {
			parts.push(
				[ ' (' + model.hash + ')', 'black' ]
			);
		}

		parts.push( [ ' ' ] );

		return parts;
	}, statusColor );
}

function addGitStageSegment( addSegment, model ) {
	if ( model.added ) {
		addSegment( () => [
			[ `+${ model.added } `, 'black' ],
		], 'green' );
	}

	if ( model.modified ) {
		addSegment( () => [
			[ `M${ model.modified } `, 'black' ],
		], 'red' );
	}

	if ( model.untracked ) {
		addSegment( () => [
			[ `?${ model.untracked } `, 'black' ],
		], 'lightBlue' );
	}
}

function bg( color ) {
	return `bg${ color.charAt( 0 ).toUpperCase() + color.substring( 1 ) }`;
}
