/**
 * A default configuration of the prompt.
 *
 * @license MIT
 */
'use strict';

/**
 * NOTE: This is a default Nodeprompt config. Do not modify it,
 *       but create `~/.nodeprompt/config.user.js` file of the same structure with
 *       your values instead.
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
	 * * `added`		(_Number_)	 	Number of files staged for the commit.
	 * * `ahead`		(_Number_)	 	Number of commits ahead of the remote branch.
	 * * `behind`		(_Number_)	 	Number of commits behind the remote branch.
	 * * `branch`		(_String_)	 	Name of the branch.
	 * * `detached`		(_Boolean_)	 	Indicates detached state of the branch (HEAD points to a commit, unnamed branch).
	 * * `hasDiverged`		(_Boolean_)	 	`true` if both `ahead` and `behind` are different than `0`.
	 * * `git`			(_String_)	 	Contains path to `.git` directory (i.e. to tell if in Git repository).
	 * * `hash`			(_String_)	 	SHA-1 hash of the current commit (see `hashLength` config option).
	 * * `host`			(_String_)	 	Name of the host.
	 * * `init`			(_Boolean_)	 	Indicates that repository has just been initialized.
	 * * `merging`		(_Boolean_)	 	Indicates merge operation.
	 * * `modified`		(_Number_)	 	Number of modified but unstaged files.
	 * * `path`			(_String_)	 	Current directory path (see `pathLength` config option).
	 * * `untracked`	(_Number_)	 	Number of untracked files in the repository.
	 * * `user`			(_String_)	 	Username.
	 *
	 * @param {Object} style An object consisting of a number of functions, all of which accept and return
	 * _String_, dedicated to change style, background or text color. See `styles.js` to know more.
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