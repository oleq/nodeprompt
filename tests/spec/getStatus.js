var	NODEPROMPT = require( '../../bin/nodeprompt' ),
	getStatus = NODEPROMPT.getStatus;

function testGetStatus( status, expected ) {
	var data = {};

	getStatus.call( NODEPROMPT, data, status );

	expect( data ).toEqual( expected );
}

describe( 'Method getStatus', function() {
	it( 'returns status when no remote', function() {
		testGetStatus( '## master', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 0,
			behind: 0,
			branch: 'master',
			diverged: false,
		} );

		testGetStatus( '## master [ahead 10]', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 10,
			behind: 0,
			branch: 'master',
			diverged: false,
		} );

		testGetStatus( '## master [behind 20]', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 0,
			behind: 20,
			branch: 'master',
			diverged: false,
		} );

		testGetStatus( '## master [ahead 10, behind 20]', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 10,
			behind: 20,
			branch: 'master',
			diverged: true,
		} );

		testGetStatus( '## foo#.1$0', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 0,
			behind: 0,
			branch: 'foo#.1$0',
			diverged: false,
		} );
	} );

	it( 'returns status when remote', function() {
		testGetStatus( '## x/1.11...remote/y/000 [ahead 10]', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 10,
			behind: 0,
			branch: 'x/1.11',
			diverged: false,
		} );

		testGetStatus( '## x/1.11...remote/y/000', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 0,
			behind: 0,
			branch: 'x/1.11',
			diverged: false,
		} );

		testGetStatus( '## x/1.11...remote/y/000 [ahead 10]', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 10,
			behind: 0,
			branch: 'x/1.11',
			diverged: false,
		} );

		testGetStatus( '## x/1.11...remote/y/000 [behind 20]', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 0,
			behind: 20,
			branch: 'x/1.11',
			diverged: false,
		} );

		testGetStatus( '## x/1.11...remote/y/000 [ahead 10, behind 20]', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 10,
			behind: 20,
			branch: 'x/1.11',
			diverged: true,
		} );
	} );

	it( 'returns status when not clean', function() {
		testGetStatus(
			'## foo\n' +
			' M foo.js\n' +
			' M bar.js',
		{
			untracked: 0,
			added: 0,
			modified: 2,
			ahead: 0,
			behind: 0,
			branch: 'foo',
			diverged: false,
		} );

		testGetStatus(
			'## foo\n' +
			'A foo.js\n' +
			' M bar.js\n' +
			'R bam.js',
		 {
			untracked: 0,
			added: 2,
			modified: 1,
			ahead: 0,
			behind: 0,
			branch: 'foo',
			diverged: false,
		} );

		testGetStatus(
			'## foo\n' +
			'A foo.js\n' +
			' M bar.js\n' +
			'?? boom.js',
		{
			untracked: 1,
			added: 1,
			modified: 1,
			ahead: 0,
			behind: 0,
			branch: 'foo',
			diverged: false,
		} );

		testGetStatus(
			'## foo\n' +
			'A foo.js\n' +
			' M bar.js\n' +
			' D ding.js\n' +
			' D dong.js\n' +
			'?? boom.js',
		{
			untracked: 1,
			added: 1,
			modified: 3,
			ahead: 0,
			behind: 0,
			branch: 'foo',
			diverged: false,
		} );

		testGetStatus(
			'## foo\n' +
			'MM foo.js\n' +
			' M bar.js\n' +
			'M  ding.js\n' +
			'AM dong.js\n' +
			'?? boom.js',
		{
			untracked: 1,
			added: 3,
			modified: 3,
			ahead: 0,
			behind: 0,
			branch: 'foo',
			diverged: false,
		} );

	} );

	it( 'returns status when detached or rebasing', function() {
		testGetStatus( '## HEAD (no branch)', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 0,
			behind: 0,
			branch: 'HEAD', // note: it's wrong
			diverged: false,
		} );
	} );

	it( 'returns status when repo inited', function() {
		testGetStatus( '## Initial commit on master', {
			untracked: 0,
			added: 0,
			modified: 0,
			ahead: 0,
			behind: 0,
			branch: 'Initial', // note: it's wrong
			diverged: false,
		} );
	} );
} );