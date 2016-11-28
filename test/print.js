/**
 * @license MIT
 */
'use strict';

const stylesRaw = require( '../lib/styles.js' )( true );
const Nodeprompt = require( '../lib/nodeprompt.js' );

let sandbox;

describe( 'print()', () => {
	beforeEach( () => {
		sandbox = sinon.sandbox.create();
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	it( 'generates PS1 when not Git repository', () => {
		test(
			{
				_getGitDirectory: () => ''
			},
			'user@host /path> '
		);
	} );

	it( 'generates PS1 when repository just inited', () => {
		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () => '## Initial commit on master',
				_getHash: () => 'HEAD'
			},
			'(init) user@host /path> '
		);
	} );

	it( 'generates PS1 when staged, not staged, deleted, untracked', () => {
		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () =>
					'## master\n' +
						'D  asd\n' +
						'A  bar\n' +
						'M  zz\n' +
						'M  dd\n' +
						'?? qwe',
				_getNameRev: () => 'master',
				_getHash: () => '44c100b03e7a6ff3d8e1ba0b536ea9b6f830f6ab',
			},
			'(master 44c100b +4 ?1) user@host /path> '
		);
	} );

	it( 'generates PS1 when detached', () => {
		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () => '## HEAD (no branch)',
				_getNameRev: () => 'master~1',
				_getHash: () => 'a89567c12b55b2d1b5635fb1178c1a1106511403',
				_getHead: () => 'a89567c12b55b2d1b5635fb1178c1a1106511403',
			},
			'(detached:master~1 a89567c) user@host /path> '
		);
	} );

	it( 'generates PS1 while merging', () => {
		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () => '## master\n' +
					'UU foo',
				_getNameRev: () => 'master',
				_getHash: () => 'dcd0272544714df9ab9c1a30b876deda3677bd77',
				_getHead: () => 'ref: refs/heads/master',
				_getMergeHead: () => 'test-head'
			},
			'(merge:master<--test-head dcd0272 M1) user@host /path> '
		);
	} );

	it( 'generates PS1 while rebasing', () => {
		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () => '## HEAD (no branch)',
				_getNameRev: () => 'master',
				_getHash: () => '76d59cb10e172bbc525dcab83edb0d074a9f8e1e',
				_getHead: () => '76d59cb10e172bbc525dcab83edb0d074a9f8e1e',
			},
			'(detached:master 76d59cb) user@host /path> '
		);
	} );

	it( 'generates PS1 while bisecting', () => {
		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () => '## a/1234...remote/a/1234 [ahead 10, behind 20]',
				_getNameRev: () => 'a/1234',
				_getHash: () => '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
				_getHead: () => 'ref: refs/heads/a/1234',
				_getIsBisecting: () => true
			},
			'(detached:a/1234 3bf5643) user@host /path> '
		);
	} );

	it( 'generates PS1 when branch is ahead', () => {
		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () => '## a/1234...remote/a/1234 [ahead 4]',
				_getNameRev: () => 'a/1234',
				_getHash: () => '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
				_getHead: () => 'ref: refs/heads/a/1234',
			},
			'(a/1234↑ 3bf5643) user@host /path> '
		);
	} );

	it( 'generates PS1 when branch is behind', () => {
		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () => '## a/1234...remote/a/1234 [behind 4]',
				_getNameRev: () => 'a/1234',
				_getHash: () => '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
				_getHead: () => 'ref: refs/heads/a/1234',
			},
			'(a/1234↓ 3bf5643) user@host /path> '
		);
	} );

	it( 'generates PS1 when branch has diverged', () => {
		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () => '## a/1234...remote/a/1234 [ahead 4, behind 8]',
				_getNameRev: () => 'a/1234',
				_getHash: () => '3bf5643b7066572b1efc4cd0421bae95cb3786c2',
				_getHead: () => 'ref: refs/heads/a/1234',
			},
			'(a/1234↕ 3bf5643) user@host /path> '
		);
	} );

	it( 'generates no PS1 when in .git directory', () => {
		test(
			{
				_getGitDirectory: () => '.',
				_getRawStatus: () => '## master\n' +
					'D  asd\n' +
					'A  bar\n' +
					'M  zz\n' +
					'M  dd\n' +
					'?? qwe',
				_getNameRev: () => 'master',
				_getHash: () => '44c100b03e7a6ff3d8e1ba0b536ea9b6f830f6ab',
				_getHead: () => 'ref: refs/heads/master',
			},
			'user@host /path> '
		);
	} );

	// #9
	it( 'generates no PS1 when in .git/* subfolder', () => {
		const PWD = process.env.PWD;

		process.env.PWD = '/foo/bar/.git/hooks';

		test(
			{
				_getGitDirectory: () => '/foo/bar/.git',
			},
			'user@host /path> '
		);

		process.env.PWD = PWD;
	} );

	it( 'generates no PS1 when in .git/* subfolder (letter case)', () => {
		const PWD = process.env.PWD;

		process.env.PWD = '/foo/BAR/.git/hooks';

		test(
			{
				_getGitDirectory: () => '/foo/bar/.git',
			},
			'user@host /path> '
		);

		process.env.PWD = PWD;
	} );

	it( 'generates PS1 when in folder containing ".git" string', () => {
		const PWD = process.env.PWD;

		process.env.PWD = '/Users/nodeprompt-user/foo.github.io';

		test(
			{
				_getGitDirectory: () => '.git',
				_getRawStatus: () =>
					'## master\n' +
						'D  asd\n' +
						'A  bar\n' +
						'M  zz\n' +
						'M  dd\n' +
						'?? qwe',
				_getNameRev: () => 'master',
				_getHash: () => '44c100b03e7a6ff3d8e1ba0b536ea9b6f830f6ab',
			},
			'(master 44c100b +4 ?1) user@host /path> '
		);

		process.env.PWD = PWD;
	} );
} );

function test( methods, expected ) {
	for ( let m in methods ) {
		sandbox.stub( Nodeprompt.prototype, m, methods[ m ] );
	}

	const nodeprompt = new Nodeprompt();

	Object.assign( nodeprompt.model, {
		user: 'user',
		hostname: 'host',
		path: '/path'
	} );

	expect( nodeprompt.print( stylesRaw ) ).to.equal( expected );
}