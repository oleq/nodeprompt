/**
 * @license MIT
 */
'use strict';

const Nodeprompt = require( '../lib/nodeprompt.js' );

let nodeprompt;

describe( '_getStatus()', () => {
	beforeEach( () => {
		nodeprompt = new Nodeprompt();
	} );

	it( 'works when no remote', () => {
		test(
			'## master',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 0,
				behind: 0,
				branch: 'master',
				hasDiverged: false,
			}
		);

		test(
			'## master [ahead 10]',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 10,
				behind: 0,
				branch: 'master',
				hasDiverged: false,
			}
		);

		test(
			'## master [behind 20]',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 0,
				behind: 20,
				branch: 'master',
				hasDiverged: false,
			}
		);

		test(
			'## master [ahead 10, behind 20]',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 10,
				behind: 20,
				branch: 'master',
				hasDiverged: true,
			}
		);

		test(
			'## foo#.1$0',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 0,
				behind: 0,
				branch: 'foo#.1$0',
				hasDiverged: false,
			}
		);
	} );

	it( 'works when remote', () => {
		test(
			'## x/1.11...remote/y/000 [ahead 10]',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 10,
				behind: 0,
				branch: 'x/1.11',
				hasDiverged: false,
			}
		);

		test(
			'## x/1.11...remote/y/000',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 0,
				behind: 0,
				branch: 'x/1.11',
				hasDiverged: false,
			}
		);

		test(
			'## x/1.11...remote/y/000 [ahead 10]',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 10,
				behind: 0,
				branch: 'x/1.11',
				hasDiverged: false,
			}
		);

		test(
			'## x/1.11...remote/y/000 [behind 20]',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 0,
				behind: 20,
				branch: 'x/1.11',
				hasDiverged: false,
			}
		);

		test(
			'## x/1.11...remote/y/000 [ahead 10, behind 20]',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 10,
				behind: 20,
				branch: 'x/1.11',
				hasDiverged: true,
			}
		);
	} );

	it( 'works when not clean', () => {
		test(
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
				hasDiverged: false,
			}
		);

		test(
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
				hasDiverged: false,
			}
		);

		test(
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
				hasDiverged: false,
			}
		);

		test(
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
				hasDiverged: false,
			}
		);

		test(
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
				hasDiverged: false,
			}
		);

	} );

	it( 'works when detached or rebasing', () => {
		test(
			'## HEAD (no branch)',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 0,
				behind: 0,
				branch: 'HEAD', // note: it's wrong
				hasDiverged: false,
			}
		);
	} );

	it( 'works when repo inited', () => {
		test(
			'## Initial commit on master',
			{
				untracked: 0,
				added: 0,
				modified: 0,
				ahead: 0,
				behind: 0,
				branch: 'Initial', // note: it's wrong
				hasDiverged: false,
			}
		);
	} );
} );

function test( rawStatus, expected ) {
	const stub = sinon.stub( nodeprompt, '_getRawStatus' ).returns( rawStatus );
	const status = nodeprompt._getStatus( {} );

	for ( let exp in expected ) {
		expect( status[ exp ] ).to.equal( expected[ exp ] );
	}

	stub.restore();
}