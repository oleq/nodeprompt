var	NODEPROMPT = require( '../../bin/nodeprompt' ),
	// Don't include user config in tests.
	config = NODEPROMPT.config = NODEPROMPT.configDefault,
	getPS1 = NODEPROMPT.getPS1,
	args = NODEPROMPT.args;

// Colorful output is too messy for testing purposes.
NODEPROMPT.styles = require( '../../lib/styles.js' )( false );

function testRunNodeprompt( args, expected ) {
	for ( var a in NODEPROMPT.args )
		delete NODEPROMPT.args[ a ];

	for ( a in args )
		NODEPROMPT.args[ a ] = args[ a ];

	expect(
		( getPS1.call( NODEPROMPT ).match( /^\([^\(]+\)/g ) || [] ).join( '' )
	).toBe( expected );
}

describe( 'Nodeprompt', function() {
	it( 'generates PS1 when not Git repository', function() {
		var args = {
			'git': '',
			'host': 'MYHOST'
		};

		testRunNodeprompt( args, '' );
	} );

	it( 'generates PS1 when repository just inited', function() {
		var args = {
			'git': '.git',
			'host': 'MYHOST',
			'status': '## Initial commit on master',
			'namerev': '',
			'hash': 'HEAD',
			'head': 'ref: refs/heads/master',
			'merge-head': ''
		};

		testRunNodeprompt( args, '(init)' );
	} );

	it( 'generates PS1 when staged, not staged, deleted, untracked', function() {
		var args = {
			'git': '.git',
			'host': 'MYHOST',
			'status': '## master\n' +
				'D  asd\n' +
				'A  bar\n' +
				'M  zz\n' +
				'M  dd\n' +
				'?? qwe',
			'namerev': 'master',
			'hash': '44c100b03e7a6ff3d8e1ba0b536ea9b6f830f6ab',
			'head': 'ref: refs/heads/master',
			'merge-head': ''
		};

		testRunNodeprompt( args, '(master 44c100b +4 ?1)' );
	} );

	it( 'generates PS1 when detached', function() {
		var args = {
			'git': '.git',
			'host': 'MYHOST',
			'status': '## HEAD (no branch)',
			'namerev': 'master~1',
			'hash': 'a89567c12b55b2d1b5635fb1178c1a1106511403',
			'head': 'a89567c12b55b2d1b5635fb1178c1a1106511403',
			'merge-head': ''
		};

		testRunNodeprompt( args, '(detached:master~1 a89567c)' );
	} );

	it( 'generates PS1 while merging', function() {
		var args = {
			'git': '.git',
			'host': 'MYHOST',
			'status': '## master\n' +
				'UU foo',
			'namerev': 'master',
			'hash': 'dcd0272544714df9ab9c1a30b876deda3677bd77',
			'head': 'ref: refs/heads/master',
			'merge-head': 'test'
		};

		testRunNodeprompt( args, '(merge:master<--test dcd0272 M1)' );
	} );

	it( 'generates PS1 while rebasing', function() {
		var args =  {
			'git': '.git',
			'host': 'MYHOST',
			'status': '## HEAD (no branch)',
			'namerev': 'master',
			'hash': '76d59cb10e172bbc525dcab83edb0d074a9f8e1e',
			'head': '76d59cb10e172bbc525dcab83edb0d074a9f8e1e',
			'merge-head': ''
		};

		testRunNodeprompt( args, '(detached:master 76d59cb)' );
	} );

	it( 'generates PS1 while bisecting', function() {
		var args = {
			'git': '.git',
			'host': 'MYHOST',
			'status': '## a/1234...remote/a/1234 [ahead 10, behind 20]',
			'namerev': 'a/1234',
			'hash': '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
			'head': 'ref: refs/heads/a/1234',
			'merge-head': '',
			'bisect-log': 'foo'
		};

		testRunNodeprompt( args, '(detached:a/1234 3bf5643)' );
	} );

	it( 'generates PS1 when branch is ahead', function() {
		var args = {
			'git': '.git',
			'host': 'MYHOST',
			'status': '## a/1234...remote/a/1234 [ahead 4]',
			'namerev': 'a/1234',
			'hash': '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
			'head': 'ref: refs/heads/a/1234',
			'merge-head': ''
		};

		testRunNodeprompt( args, '(a/1234↑ 3bf5643)' );
	} );

	it( 'generates PS1 when branch is behind', function() {
		var args = {
			'git': '.git',
			'host': 'MYHOST',
			'status': '## a/1234...remote/a/1234 [behind 4]',
			'namerev': 'a/1234',
			'hash': '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
			'head': 'ref: refs/heads/a/1234',
			'merge-head': ''
		};

		testRunNodeprompt( args, '(a/1234↓ 3bf5643)' );
	} );

	it( 'generates PS1 when branch diverged', function() {
		var args = {
			'git': '.git',
			'host': 'MYHOST',
			'status': '## a/1234...remote/a/1234 [ahead 10, behind 20]',
			'namerev': 'a/1234',
			'hash': '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
			'head': 'ref: refs/heads/a/1234',
			'merge-head': ''
		};

		testRunNodeprompt( args, '(a/1234↕ 3bf5643)' );
	} );

	it( 'generates no PS1 when in .git directory', function() {
		var args = {
			'git': '.',
			'host': 'MYHOST',
			'status': '## master\n' +
				'D  asd\n' +
				'A  bar\n' +
				'M  zz\n' +
				'M  dd\n' +
				'?? qwe',
			'namerev': 'master',
			'hash': '44c100b03e7a6ff3d8e1ba0b536ea9b6f830f6ab',
			'head': 'ref: refs/heads/master',
			'merge-head': ''
		};

		testRunNodeprompt( args, '' );
	} );
} );