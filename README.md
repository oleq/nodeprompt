Nodeprompt &mdash; Pretty Git prompt for Bash
==================================================

## Requirements

* Bash (tested with 3.2.x).
* Node.js (tested with 0.10.x).
* Git (tested with 1.9.x).

## Installation

1. Call `npm install -g nodeprompt`.
1. Put the following line

		. nodeprompt-enable

 in your `~/.bashrc` or `~/.bash_profile` file.
1. Re&ndash;open terminal window or source the file, i.e. `source ~/.bashrc`.
1. Enjoy your beautiful prompt!

## Configuration and customization

Nodeprompt is configurable, i.e. the length of SHA-1 hash or the number of levels 
displayed in path can be changed. You can completely re&ndash;write the prompt template, 
if you really want to though.

**Note**: You **don't** need to create any config file in order to get Nodeprompt working.
It will use `config.default.js`.

Nodeprompt config is a plain Node.js module. To configure/customize your prompt, 
create `~/.nodeprompt/config.user.js` file with `module.exports` object

	module.exports = {
		option: 'value'
	};

or simply copy `config.default.js`. Please refer to documentation inside `config.default.js`
to learn more.

## FAQ

1. **Q**: Why is data collected in Bash? Why not `require( 'child_process' ).exec`? Come on man, what's wrong with you?
 <br/> 
 **A**: Child Process is really, really slow and makes the prompt laggy. UX is the priority and, as long as Bash
 is faster, that's the right way. I don't like it either.
2. **Q**: &lt;xyz&gt; sucks in `bin/nodeprompt-enable`. Why?
 <br/> 
 **A**: It's Bash. So what?

## License
 
MIT/X11. See the [LICENSE](LICENSE) file to know more.

## Misc

Kudos to [Leonid Volnitsky](https://github.com/lvv) for his [git-prompt](https://github.com/lvv/git-prompt),
which was an inspiration.

## Tests

Call `npm test` or `node tests/tester.js` to run tests.