module.exports = {
	"env": {
		"commonjs": true,
		"es6": true,
		"mocha": true,
	},
	"globals": {
		"expect": true,
		"sinon": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 6
	},
	"rules": {
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
