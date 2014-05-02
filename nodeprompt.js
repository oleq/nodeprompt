#!/usr/bin/env node

'use strict';

var args = require( 'optimist' ).argv,
	styles = require( './styles.js' )( !args.raw ),
	configDefault = require( './config.default.js' ),
	configUser = {};

try {
	configUser = require( './config.js' );
} catch ( e ) {}

var NODEPROMPT = {
	/**
	 * Re-shapes given `path` according to `config#pathLength`,
	 * and stores it in `data` object.
	 *
	 * @param {Object} data
	 * @param {String} path
	 * @param {String} home
	 */
	getPath: function( data, path, home ) {
		var homeRegex = new RegExp( '^' + home ),
			inHome = path.match( homeRegex );

		if ( inHome )
			path = path.replace( homeRegex, '' );

		path = path.split( '/' );

		if ( !path[ 0 ] )
			path = path.slice( 1 );

		if ( !path[ path.length - 1 ] )
			path = path.slice( 0, -1 );

		if ( path.length > this.config.pathLength ) {
			path = path.slice( -this.config.pathLength );
			path[ 0 ] = '...' + path[ 0 ];
		}

		path = path.join( '/' );

		if ( inHome )
			path = '~' + ( path.length === 0 ? '' : '/' ) + path;
		else
			path = '/' + path;

		data.path = path;
	},

	/**
	 * Parses `git status --porcelain` output into
	 * `data` object format.
	 *
	 * @param {Object} data
	 * @param {String} status
	 */
	getStatus: function( data, status ) {
		var statusArray = status.split( '\n' ),
			branchLine = statusArray.shift().slice( 3 );

		data.modified = data.deleted = data.added = data.renamed = data.untracked = 0;

		if ( !data.detached && !data.init ) {
			var ahead = ( /\[ahead (\d+)/g ).exec( branchLine ),
				behind = ( /behind (\d+)\]/g ).exec( branchLine );

			data.ahead = ahead ? parseInt( ahead[ 1 ], 10 ) : 0;
			data.behind = behind ? parseInt( behind[ 1 ], 10 ) : 0;
			data.branch = ( /^(.+?)(?:(?=\.{2}| )|$)/g ).exec( branchLine )[ 1 ];
		}

		statusArray.forEach( function( item ) {
			var status = item.slice( 0, 2 );

			// "M " for staged.
			// " M" for unstaged.
			// "MM" for changes in staged.
			~status.indexOf( 'M' ) && data.modified++;

			// "A " for added.
			// "AM" for added but modified.
			~status.indexOf( 'A' ) && data.added++;
			~status.indexOf( 'D' ) && data.deleted++;
			~status.indexOf( 'R' ) && data.renamed++;
			~status.indexOf( '??' ) && data.untracked++;
		} );

		data.diverged = !!( data.ahead && data.behind );
	},

	/**
	 * Returns pretty `PS1` prompt string, using
	 * available data.
	 *
	 * @returns {String}
	 */
	getPS1: function() {
		var data = {
			git: !!args.git,
			host: args.host,
			user: args.user
		};

		this.getPath( data, process.env.PWD, process.env.HOME );

		if ( data.git ) {
			data.namerev = args.namerev;

			// There's no hash when inited.
			data.init = args.hash == 'HEAD';

			// .git/HEAD starts with hash when detached.
			data.detached = !args.head.match( /^ref: /g ) || args[ 'bisect-log' ];

			// .git/MERGE_HEAD is a hash of a branch when merging.
			data.merging = args[ 'merge-head' ];

			this.getStatus( data, args.status );

			data.hash = args.hash.slice( 0, this.config.hashLength );
		}

		return this.config.template( data, this.styles );
	},

	/**
	 * Configuration object. See `config.default.js` file to know more.
	 *
	 * @property {Object}
	 */
	config: ( function() {
		for ( var c in configUser )
			configDefault[ c ] = configUser[ c ];

		return configDefault;
	} )(),

	/**
	 * Styles object. See `config.js.tpl` file to know more.
	 *
	 * @property {Object}
	 */
	styles: styles,

	// For dev purposes only.
	args: args
};

if ( module.parent )
	module.exports = NODEPROMPT;
else
	process.stdout.write( NODEPROMPT.getPS1() );