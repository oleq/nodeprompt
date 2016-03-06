'use strict';

global.chai = require( 'chai' );
global.expect = global.chai.expect;

// Import app namespace.
global.NODEPROMPT = require( '../bin/nodeprompt' );

// Don't include user config in tests.
global.NODEPROMPT.config = global.NODEPROMPT.configDefault;

// Colorful output is too messy for testing purposes.
global.NODEPROMPT.styles = require( '../lib/styles.js' )( true );