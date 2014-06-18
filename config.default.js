'use strict';

/**
 * NOTE: This is a default Nodeprompt config. Do not overwrite it,
 *       but create `config.js` file of the same structure with
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
	 * Template (V-layer :P) of the prompt. A function, which converts status data into
	 * a nice, colourful prompt string. You can take control of the look and feel of your
	 * bash prompt by creating your own `template` function.
	 *
	 * @cfg {Function} template
	 * @param {Object} data Status data object, which consists of the following items:
	 *
	 * * `added`		(_Number_)	 	Number of files staged for the commit.
	 * * `ahead`		(_Number_)	 	Number of commits ahead of the remote branch.
	 * * `behind`		(_Number_)	 	Number of commits behind the remote branch.
	 * * `branch`		(_String_)	 	Name of the branch.
	 * * `detached`		(_Boolean_)	 	Indicates detached state of the branch (HEAD points to a commit, unnamed branch).
	 * * `diverged`		(_Boolean_)	 	`true` if both `ahead` and `behind` are different than `0`.
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
	template: function( data, styles ) {
		var text = '';

		if ( data.git ) {
			var statusStyle =
				data.merging ? styles.lightMagenta :
				data.detached ? styles.red :
				data.modified ? styles.red :
				data.added ? styles.lightGreen :
				data.untracked ? styles.lightBlue :
				styles.darkGray;

			text += statusStyle( '(' );

			// Standard style if inited.
			if ( data.init )
				text += 'init';
			else if ( data.detached )
				text += statusStyle( 'detached:' + data.namerev );
			else if ( data.merging )
				text += statusStyle( 'merge:' + data.namerev + '<--' + data.merging );
			else
				text += statusStyle( data.branch );

			if ( data.diverged )
				text += styles.bold( styles.lightYellow( '↕' ) );
			else {
				if ( data.ahead )
					text += styles.bold( styles.lightYellow( '↑' ) );
				else if ( data.behind )
					text += styles.bold( styles.lightYellow( '↓' ) );
			}

			// No hash to be displayed if inited.
			if ( !data.init )
				text += ' ' + styles.bold( styles.darkGray( data.hash ) );

			if ( data.added )
				text += styles.lightGreen( ' +' + data.added );

			if ( data.modified )
				text += styles.red( ' M' + data.modified );

			if ( data.untracked )
				text += styles.lightBlue( ' ?' + data.untracked );

			text += statusStyle( ') ' );
		}

		text += styles.lightGreen( data.user + '@' + data.host );
		text += ' ' + styles.lightCyan( data.path + this.promptChar + ' ' );

		return text;
	}
};