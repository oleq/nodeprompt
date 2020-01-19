/**
 * @license MIT
 */

/* global process */

'use strict';

const Nodeprompt = require( '../lib/nodeprompt.js' );
const proxyquire = require( 'proxyquire' ).noCallThru();
const env = process.env;

describe( 'Nodeprompt', () => {
	let sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor', () => {
		describe( 'config', () => {
			it( 'provides the default #config', () => {
				const prompt = new Nodeprompt();
				const config = prompt.config;

				expect( config.hashLength ).to.equal( 7 );
				expect( config.pathLength ).to.equal( 2 );
				expect( config.template ).to.be.a( 'function' );
			} );

			it( 'accepts a custom config (full)', () => {
				const prompt = new Nodeprompt( {
					hashLength: 1,
					pathLength: 2,
					promptChar: 'foo',
					template: () => 'bar'
				} );

				const config = prompt.config;

				expect( config.hashLength ).to.equal( 1 );
				expect( config.pathLength ).to.equal( 2 );
				expect( config.template() ).to.equal( 'bar' );
			} );

			it( 'accepts a custom config (partial)', () => {
				const prompt = new Nodeprompt( {
					hashLength: 1,
					template: () => 'bar'
				} );

				const config = prompt.config;

				expect( config.hashLength ).to.equal( 1 );
				expect( config.pathLength ).to.equal( 2 );
				expect( config.template() ).to.equal( 'bar' );
			} );

			it( 'searches for userconfig in env.HOME', () => {
				const restoreEnv = stubEnv( {
					HOME: 'path/to/home',
					HOMEPATH: null,
					USERPROFILE: null,
				} );

				const configPath = env.HOME + '/.nodeprompt/config.user.js';
				const stubs = {};

				stubs[ configPath ] = {
					foo: 'bar'
				};

				const Nodeprompt = proxyquire( '../lib/nodeprompt.js', stubs );
				const prompt = new Nodeprompt();

				expect( prompt.config.foo ).to.equal( 'bar' );

				restoreEnv();
			} );

			it( 'searches for userconfig in env.HOMEPATH', () => {
				const restoreEnv = stubEnv( {
					HOME: null,
					HOMEPATH: 'path/to/home',
					USERPROFILE: null,
				} );

				const configPath = env.HOMEPATH + '/.nodeprompt/config.user.js';
				const stubs = {};

				stubs[ configPath ] = {
					foo: 'bar'
				};

				const Nodeprompt = proxyquire( '../lib/nodeprompt.js', stubs );
				const prompt = new Nodeprompt();

				expect( prompt.config.foo ).to.equal( 'bar' );

				restoreEnv();
			} );

			it( 'searches for userconfig in env.USERPROFILE', () => {
				const restoreEnv = stubEnv( {
					HOME: null,
					HOMEPATH: null,
					USERPROFILE: 'path/to/home',
				} );

				const configPath = env.USERPROFILE + '/.nodeprompt/config.user.js';
				const stubs = {};

				stubs[ configPath ] = {
					foo: 'bar'
				};

				const Nodeprompt = proxyquire( '../lib/nodeprompt.js', stubs );
				const prompt = new Nodeprompt();

				expect( prompt.config.foo ).to.equal( 'bar' );

				restoreEnv();
			} );
		} );

		it( 'provides #model', () => {
			const prompt = new Nodeprompt();

			expect( prompt.model ).to.have.keys( [
				'pwd',
				'home',
				'gitDir',
				'isGit',
				'hostname',
				'username',
				'path',
				'namerev',
				'head',
				'hash',
				'mergeHead',
				'isInit',
				'isBisecting',
				'isDetached',
				'isMerging',
				'modified',
				'added',
				'untracked',
				'ahead',
				'behind',
				'branch',
				'hasDiverged',
			] );
		} );

		it( 'provides #styles', () => {
			const prompt = new Nodeprompt();

			expect( prompt.styles ).to.be.an( 'object' );
			expect( Object.keys( prompt.styles ) ).to.have.length( 37 );
		} );
	} );
} );

function stubEnv( stub ) {
	const originalValues = {};

	for ( const prop in stub ) {
		originalValues[ prop ] = env[ prop ];

		if ( !stub[ prop ] ) {
			delete env[ prop ];
		} else {
			env[ prop ] = stub[ prop ];
		}
	}

	return () => {
		for ( const prop in stub ) {
			env[ prop ] = originalValues[ prop ];
		}
	};
}
