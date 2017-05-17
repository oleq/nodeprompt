/**
 * A main module which brings the Nodeprompt class.
 *
 * @license MIT
 */

'use strict';

const spawnSync = require( 'child_process' ).spawnSync;
const os = require( 'os' );
const env = process.env;

const stylesDefault = require( './styles.js' )();
const configDefault = require( './../config.default.js' );

const isAheadRegex = /\[ahead (\d+)/;
const isBehindRegex = /behind (\d+)\]/;
const isDetachedRegex = /^ref: /g;
const getBranchRegex = /^(.+?)(?:(?=\.{2}| )|$)/;

const recordedInIndex = new Set( [ 'M', 'A', 'D', 'R', 'C' ] );
const modifiedInWorkTree = new Set( [ 'M', 'A', 'U', 'D' ] );

/**
 * The class representing a Git prompt instance.
 */
class Nodeprompt {
	/**
	 * Creates an instance of `Nodeprompt`.
	 *
	 * @param {Object} [config={}] A custom config to be used.
	 */
	constructor( config = {} ) {
		/**
		 * Configuration object. See `config.default.js` file to know more.
		 *
		 * @property {Object}
		 */
		this.config = this._getConfig( config );

		/**
		 * The model of the prompt.
		 *
		 * @property {Object}
		 */
		this.model = this._getModel();
	}

	/**
	 * Prints the {@link #model} of the prompt using {@link #config.template}.
	 *
	 * @param {Object} [styles] A custom styles used to print the output.
	 * @returns {String} The string to be set as PS1.
	 */
	print( styles ) {
		return this.config.template( this.model, styles || stylesDefault );
	}

	/**
	 * Fills the {@link #model} with the information about the system, environment
	 * and the git repository.
	 *
	 * @protected
	 * @returns {Object} The model of the prompt.
	 */
	_getModel() {
		const model = {};

		model.pwd = env.PWD;
		model.home = env.HOME;
		model.gitDir = this._getGitDirectory();
		model.isGit = this._getIsGit( model );
		model.hostname = os.hostname();
		model.username = os.userInfo().username;
		model.path = this._getPath( model );

		if ( model.isGit ) {
			const head = this._getHead( model );
			const hash = this._getHash().slice( 0, this.config.hashLength );
			const isBisecting = this._getIsBisecting( model );

			model.namerev = this._getNameRev();
			model.head = head;
			model.hash = hash;
			model.mergeHead = this._getMergeHead( model );
			model.isInit = hash === 'HEAD';
			model.isBisecting = isBisecting;
			model.isDetached = !!( !head.match( isDetachedRegex ) || isBisecting );
			model.isMerging = !!model.mergeHead;

			Object.assign( model, this._getStatus( model ) );
		}

		return model;
	}

	/**
	 * Returns a configuration object containing merged options from:
	 *  * `config.default.js`,
	 *  * user config,
	 *  * custom config passed to the instance.
	 *
	 * @param {Object} config
	 * @returns {Object}
	 */
	_getConfig( config ) {
		let userConfig = {};

		try {
			userConfig = require(
				( env.HOME || env.HOMEPATH || env.USERPROFILE ) + '/.nodeprompt/config.user.js'
			);

		} catch( e ) {}

		return Object.assign( {}, configDefault, userConfig, config );
	}

	/**
	 * Formats given the path according to `config#pathLength`.
	 *
	 * @protected
	 * @returns {String} Formatted path.
	 */
	_getPath( model ) {
		let path = model.pwd;
		const homeRegex = new RegExp( '^' + model.home );
		const inHome = path.match( homeRegex );

		if ( inHome ) {
			path = path.replace( homeRegex, '' );
		}

		path = path.split( '/' );

		if ( !path[ 0 ] ) {
			path = path.slice( 1 );
		}

		if ( !path[ path.length - 1 ] ) {
			path = path.slice( 0, -1 );
		}

		if ( path.length > this.config.pathLength ) {
			path = path.slice( -this.config.pathLength );
			path[ 0 ] = `...${ path[ 0 ] }`;
		}

		path = path.join( '/' );

		if ( inHome ) {
			path = `~${ ( !path.length ? '' : '/' ) }${ path }`;
		} else {
			path = `/${ path }`;
		}

		return path;
	}

	/**
	 * Returns a path to the `.git` directory.
	 *
	 * @protected
	 * @returns {String}
	 */
	_getGitDirectory() {
		return spawn( 'git', [ 'rev-parse', '--git-dir' ] ).toLowerCase();
	}

	/**
	 * Checks whether PWD is in the Git repository.
	 *
	 * @protected
	 * @returns {Boolean}
	 */
	_getIsGit( model ) {
		const gitDir = model.gitDir;
		const pwd = env.PWD.toLowerCase();

		// Check if not under the ".git" folder (#7, #9).
		return !!gitDir && gitDir !== '.' &&
			(
				gitDir === '.git' ?
					( pwd.slice( -4 ) != gitDir )
				:
					( pwd.indexOf( gitDir ) === -1 )
			);
	}

	/**
	 * Returns the raw status string provided by `git status`.
	 *
	 * @protected
	 * @returns {String}
	 */
	_getRawStatus() {
		return spawn( 'git', [ 'status', '--porcelain', '--branch' ] );
	}

	/**
	 * Parses the raw status string provided by `git status`
	 * returns it in the object format.
	 *
	 * @protected
	 * @returns {Object}
	 */
	_getStatus( model ) {
		const rawStatus = this._getRawStatus();
		const statusArray = rawStatus.split( '\n' );
		const branchLine = statusArray.shift().slice( 3 );

		let modified = 0;
		let added = 0;
		let untracked = 0;
		let ahead = 0;
		let behind = 0;
		let branch;

		if ( !model.isDetached && !model.isInit ) {
			ahead = branchLine.match( isAheadRegex );
			behind = branchLine.match( isBehindRegex );

			ahead = ahead ? parseInt( ahead[ 1 ], 10 ) : 0;
			behind = behind ? parseInt( behind[ 1 ], 10 ) : 0;

			branch = branchLine.match( getBranchRegex )[ 0 ];
		}

		// See: http://git-scm.com/docs/git-status.html
		//
		// For paths with merge conflicts, X and Y show the modification states of each side of the merge.
		// For paths that do not have merge conflicts, X shows the status of the index, and Y shows the
		// status of the work tree.
		// For untracked paths, XY are ??.
		// Other status codes can be interpreted as follows:
		// -------------------------------------------------
		// X          Y     Meaning
		// -------------------------------------------------
		//           [MD]   not updated
		// M        [ MD]   updated in index
		// A        [ MD]   added to index
		// D         [ M]   deleted from index
		// R        [ MD]   renamed in index
		// C        [ MD]   copied in index
		// [MARC]           index and work tree matches
		// [ MARC]     M    work tree changed since index
		// [ MARC]     D    deleted in work tree
		// -------------------------------------------------
		// D           D    unmerged, both deleted *
		// A           U    unmerged, added by us *
		// U           D    unmerged, deleted by them
		// U           A    unmerged, added by them *
		// D           U    unmerged, deleted by us
		// A           A    unmerged, both added
		// U           U    unmerged, both modified
		// -------------------------------------------------
		// ?           ?    untracked
		// !           !    ignored
		// -------------------------------------------------
		for ( let [ x, y ] of statusArray ) {
			if ( x == '?' && y == '?') {
				untracked++;
			} else {
				if ( recordedInIndex.has( x ) ) {
					added++;
				}

				if ( modifiedInWorkTree.has( y ) ) {
					modified++;
				}
			}
		}

		return {
			modified, added, untracked, ahead, behind, branch,
			hasDiverged: !!( ahead && behind )
		};
	}

	/**
	 * Returns the raw output provided by `git name-rev`.
	 *
	 * @protected
	 * @returns {String}
	 */
	_getNameRev() {
		return spawn( 'git', [ 'name-rev', '--name-only', 'HEAD' ] );
	}

	/**
	 * Returns the current SHA-1 hash in the repository.
	 *
	 * @protected
	 * @returns {String}
	 */
	_getHash() {
		return spawn( 'git', [ 'rev-parse', 'HEAD' ] );
	}

	/**
	 * Returns the content of `.git/HEAD`.
	 *
	 * @protected
	 * @returns {String}
	 */
	_getHead( model ) {
		return spawn( 'cat', [ `${ model.gitDir }/HEAD` ] );
	}

	/**
	 * Returns the raw information about the `.git/MERGE_HEAD`.
	 *
	 * @protected
	 * @returns {String}
	 */
	_getMergeHead( model ) {
		return spawn( 'git', [ 'name-rev', '--name-only', spawn( 'cat', [ `${ model.gitDir }/MERGE_HEAD` ] ) ] );
	}

	/**
	 * Tells whether there's a bisect process is performed.
	 *
	 * @protected
	 * @returns {Boolean}
	 */
	_getIsBisecting( model ) {
		return !!spawn( 'cat', [ `${ model.gitDir }/BISECT_LOG` ] );
	}
}

// A helper which spawns synchronous processes and outputs the `stdout`.
//
// @private
// @returns {String} The `stdout`.
function spawn( ...args ) {
	return spawnSync( ...args ).stdout.toString().trim();
}

module.exports = Nodeprompt;