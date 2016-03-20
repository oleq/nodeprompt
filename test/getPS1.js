'use strict';

describe( 'getPS1', () => {
	it( 'generates PS1 when not Git repository', () => {
		test( {
			git: '',
			host: 'MYHOST'
		}, '' );
	} );

	it( 'generates PS1 when repository just inited', () => {
		test( {
			git: '.git',
			host: 'MYHOST',
			status: '## Initial commit on master',
			namerev: '',
			hash: 'HEAD',
			head: 'ref: refs/heads/master',
			'merge-head': ''
		}, '(init)' );
	} );

	it( 'generates PS1 when staged, not staged, deleted, untracked', () => {
		test( {
			git: '.git',
			host: 'MYHOST',
			status: '## master\n' +
				'D  asd\n' +
				'A  bar\n' +
				'M  zz\n' +
				'M  dd\n' +
				'?? qwe',
			namerev: 'master',
			hash: '44c100b03e7a6ff3d8e1ba0b536ea9b6f830f6ab',
			head: 'ref: refs/heads/master',
			'merge-head': ''
		}, '(master 44c100b +4 ?1)' );
	} );

	it( 'generates PS1 when detached', () => {
		test( {
			git: '.git',
			host: 'MYHOST',
			status: '## HEAD (no branch)',
			namerev: 'master~1',
			hash: 'a89567c12b55b2d1b5635fb1178c1a1106511403',
			head: 'a89567c12b55b2d1b5635fb1178c1a1106511403',
			'merge-head': ''
		}, '(detached:master~1 a89567c)' );
	} );

	it( 'generates PS1 while merging', () => {
		test( {
			git: '.git',
			host: 'MYHOST',
			status: '## master\n' +
				'UU foo',
			namerev: 'master',
			hash: 'dcd0272544714df9ab9c1a30b876deda3677bd77',
			head: 'ref: refs/heads/master',
			'merge-head': 'test'
		}, '(merge:master<--test dcd0272 M1)' );
	} );

	it( 'generates PS1 while rebasing', () => {
		test( {
			git: '.git',
			host: 'MYHOST',
			status: '## HEAD (no branch)',
			namerev: 'master',
			hash: '76d59cb10e172bbc525dcab83edb0d074a9f8e1e',
			head: '76d59cb10e172bbc525dcab83edb0d074a9f8e1e',
			'merge-head': ''
		}, '(detached:master 76d59cb)' );
	} );

	it( 'generates PS1 while bisecting', () => {
		test( {
			git: '.git',
			host: 'MYHOST',
			status: '## a/1234...remote/a/1234 [ahead 10, behind 20]',
			namerev: 'a/1234',
			hash: '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
			head: 'ref: refs/heads/a/1234',
			'merge-head': '',
			'bisect-log': 'foo'
		}, '(detached:a/1234 3bf5643)' );
	} );

	it( 'generates PS1 when branch is ahead', () => {
		test( {
			git: '.git',
			host: 'MYHOST',
			status: '## a/1234...remote/a/1234 [ahead 4]',
			namerev: 'a/1234',
			hash: '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
			head: 'ref: refs/heads/a/1234',
			'merge-head': ''
		}, '(a/1234↑ 3bf5643)' );
	} );

	it( 'generates PS1 when branch is behind', () => {
		test( {
			git: '.git',
			host: 'MYHOST',
			status: '## a/1234...remote/a/1234 [behind 4]',
			namerev: 'a/1234',
			hash: '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
			head: 'ref: refs/heads/a/1234',
			'merge-head': ''
		}, '(a/1234↓ 3bf5643)' );
	} );

	it( 'generates PS1 when branch diverged', () => {
		test( {
			git: '.git',
			host: 'MYHOST',
			status: '## a/1234...remote/a/1234 [ahead 10, behind 20]',
			namerev: 'a/1234',
			hash: '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
			head: 'ref: refs/heads/a/1234',
			'merge-head': ''
		}, '(a/1234↕ 3bf5643)' );
	} );

	it( 'generates no PS1 when in .git directory', () => {
		test( {
			git: '.',
			host: 'MYHOST',
			status: '## master\n' +
				'D  asd\n' +
				'A  bar\n' +
				'M  zz\n' +
				'M  dd\n' +
				'?? qwe',
			namerev: 'master',
			hash: '44c100b03e7a6ff3d8e1ba0b536ea9b6f830f6ab',
			head: 'ref: refs/heads/master',
			'merge-head': ''
		}, '' );
	} );

	// #9
	it( 'generates no PS1 when in .git/* subfolder', () => {
		// Save PWD
		const PWD = process.env.PWD;

		process.env.PWD = '/Users/nodeprompt-user/repo/.git/hooks';

		const args = {
			git: '/Users/nodeprompt-user/repo/.git',
			host: 'MYHOST'
		};

		test( args, '' );

		// Revert PWD
		process.env.PWD = PWD;
	} );
} );

function test( args, expected ) {
	let a;

	for ( a in NODEPROMPT.args ) {
		delete NODEPROMPT.args[ a ];
	}

	for ( a in args ) {
		NODEPROMPT.args[ a ] = args[ a ];
	}

	expect(
		( NODEPROMPT.getPS1().match( /^\([^\(]+\)/g ) || [] ).join( '' )
	).to.be.equal( expected );
}