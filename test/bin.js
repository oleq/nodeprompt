/**
 * @license MIT
 */

/* global process */

'use strict';

const Nodeprompt = require( '../lib/nodeprompt.js' );

let sandbox;

describe( 'bin/nodeprompt', () => {
	beforeEach( () => {
		sandbox = sinon.sandbox.create();
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	it( 'outputs the prompt to stdout when run', () => {
		sandbox.stub( Nodeprompt.prototype, 'print' ).returns( 'foo' );
		const stdOutSpy = sandbox.spy( process.stdout, 'write' );
		const stdErrSpy = sandbox.spy( process.stderr, 'write' );

		require( '../bin/nodeprompt' );

		sinon.assert.calledOnce( stdOutSpy );
		sinon.assert.calledWithExactly( stdOutSpy, 'foo' );

		sinon.assert.notCalled( stdErrSpy );
	} );
} );
