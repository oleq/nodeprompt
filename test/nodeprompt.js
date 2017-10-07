/**
 * @license MIT
 */

'use strict';

const Nodeprompt = require( '../lib/nodeprompt.js' );

describe( 'Nodeprompt', () => {
	describe( 'constructor', () => {
		describe( 'config', () => {
			it( 'provides the default #config', () => {
				const prompt = new Nodeprompt();
				const config = prompt.config;

				expect( config.hashLength ).to.equal( 7 );
				expect( config.pathLength ).to.equal( 3 );
				expect( config.promptChar ).to.equal( '>' );
				expect( config.template ).to.be.a.function;
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
				expect( config.promptChar ).to.equal( 'foo' );
				expect( config.template() ).to.equal( 'bar' );
			} );

			it( 'accepts a custom config (partial)', () => {
				const prompt = new Nodeprompt( {
					hashLength: 1,
					template: () => 'bar'
				} );

				const config = prompt.config;

				expect( config.hashLength ).to.equal( 1 );
				expect( config.pathLength ).to.equal( 3 );
				expect( config.promptChar ).to.equal( '>' );
				expect( config.template() ).to.equal( 'bar' );
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

			expect( prompt.styles ).to.be.an.object;
			expect( Object.keys( prompt.styles ) ).to.have.length( 37 );
		} );
	} );
} );