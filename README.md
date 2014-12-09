Nodeprompt &mdash; Pretty Git prompt for Bash
==================================================

## Requirements

* Bash (tested with 3.2.x).
* Node.js (tested with 0.10.x).
* Git (tested with 1.9.x).

## Installation

1. Clone or download the repository.
1. Call `npm install` to install dependencies.

## Integration

Nodeprompt works with both bash and fish prompts.

### Bash

1. Put the following line

		. /path/to/nodeprompt/nodeprompt.sh

 in your `~/.bashrc` or `~/.bash_profile` file.
1. Re-open terminal window or source the file, i.e. `source ~/.bashrc`.

### Fish

1. Add nodeprompt to the $PATH

		set -U fish_user_paths $fish_user_paths /path/to/nodeprompt/

1. Link `fish_prompt.fish` to your fish functions:

		ln -s /path/to/nodeprompt/fish_prompt.fish ~/.config/fish/functions/fish_prompt.fish

   If `functions` directory does not exists you need to create it.
1. Re-open terminal window.

## Configuration and customization

Config file will let you configure a some simple things like the length of SHA-1 hash or
the number of levels displayed in path. Still, you can completely re&ndash;write prompt
template, if you really want to. You **don't** need to create config file in order to get
Nodeprompt working.

Nodeprompt config is a plain Node.js module. To configure or customize your prompt,
create `config.js` file in `/path/to/nodeprompt/` folder, which defines `module.exports` object

	module.exports = {
		option: 'value'
	}

or simply clone `config.default.js`. Please refer to documentation inside `config.default.js`
to know more about.

## FAQ

1. **Q**: Why is data collected in Bash? Why not `require( 'child_process' ).exec`? Come on man, what's wrong with you?
 <br/>
 **A**: Child Process is really, really slow and makes the prompt laggy. UX is the priority and, as long as Bash
 is faster, that's the right way. I don't like it either.
2. **Q**: &lt;xyz&gt; sucks in `nodeprompt.sh`. Why?
 <br/>
 **A**: It's Bash. So what?

## License

MIT/X11. See the [LICENSE](LICENSE) file to know more.

## Misc

Kudos to [Leonid Volnitsky](https://github.com/lvv) for his [git-prompt](https://github.com/lvv/git-prompt),
which was an inspiration.

## Tests

Call `npm test` or `node tests/tester.js` to run tests.