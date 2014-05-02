var jasmine = require( 'jasmine-node' );

jasmine.executeSpecsInFolder( {
	specFolders: [ __dirname + '/spec' ],
	onComplete: function( runner, log ){
		process.exit( parseInt( !!runner.results().failedCount, 10 ) );
	},
	isVerbose: true,
	showColors: true
} );