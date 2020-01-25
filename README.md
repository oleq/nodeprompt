Nodeprompt
==================================================

A smart Git prompt for your terminal powered by Node.js.

![Staged, unstaged and untracked files](demo/git-various.png?raw=true)

## Requirements

### System

* Bash 3.2.x
* [Fish](https://fishshell.com/) 2.5.x
* Zsh 5.3
* [Node.js](https://nodejs.org/) (tested with 0.10.x, 5.7.x, 6.9.x, 10.x).
* [Git](https://git-scm.com/) (tested with 1.9.x, 2.7.x, 2.11.x, 2.14.x, 2.25.x).

**Note:** There is a good change Nodeprompt will work with other configurations — just give it a shot and let me know!

### Font

**Since v2.0.0 Nodeprompt requires some special (powerline) symbols to be supported by the terminal font to render properly.**

Some fonts support those symbols (glyphs) out–of–the–box, for instance, [Fira Code](https://github.com/tonsky/FiraCode) used in examples below. Many open–source fonts have been patched and [can be downloaded from GitHub](https://github.com/powerline/fonts). If neither works for you, you can google "[your font name] powerline" because it's likely someone patched your favorite font and posted it on–line.

**A note for iTerm 2 users**: Make sure the powerline–compatible font is enabled in both  `Profiles > Text > Font` and `Profiles > Text > Non–ASCII Font`.

## Examples

### A plain folder (no Git)

![A simple folder](demo/no-git.png?raw=true)

### An empty Git repository

![An empty Git repository](demo/git-init.png?raw=true)

### Unstaged changes

![Unstaged changes](demo/git-unstaged.png?raw=true)

### Staged, unstaged and untracked

![Staged, unstaged and untracked files](demo/git-various.png?raw=true)

### Branch ahead of the remote

![Branch ahead](demo/git-ahead.png?raw=true)

### Merge conflict

![Merge conflict](demo/git-merge-conflict.png?raw=true)

## Installation

1. Call `npm install -g nodeprompt` (or `yarn global add nodeprompt`).
2. Configure your shell:

	### Bash

	Put the following line:

	```bash
	. nodeprompt-enable-bash
	```

	in your `~/.bashrc` or `~/.bash_profile` file. Re&ndash;open the terminal window or source the file, e.g. `source ~/.bashrc`.

	### Zsh

	Put the following lines:

	```bash
	. nodeprompt-enable-zsh
	```

	in your `~/.zshrc` file. Re&ndash;open the terminal window or `source ~/.zshrc`.

	### Fish

	Create a symbolic link to the `fish_prompt.fish` function file:

	```bash
	ln -s /path/to/../nodeprompt/bin/fish_prompt.fish ~/.config/fish/functions/fish_prompt.fish
	```

	Re&ndash;open the terminal window.

1. Enjoy your beautiful prompt!

## Configuration and customization

Nodeprompt is configurable and things like the length of the SHA-1 hash or the number of levels displayed in the path can be adjusted. It is also possible to create a new prompt template from scratch, if that's what you want to do tonight.

**Note**: You **don't** have to configure Nodeprompt. By default, it uses [`config.default.js`](https://github.com/oleq/nodeprompt/blob/master/config.default.js).

The config file is a plain Node.js module. To configure your prompt, create a `~/.nodeprompt/config.user.js` file with `module.exports`:

```js
module.exports = {
    option: 'value'
};
```

or simply copy [the default configuration](https://github.com/oleq/nodeprompt/blob/master/config.default.js) and modify it. Refer to the [documentation](https://github.com/oleq/nodeprompt/blob/master/config.default.js) to learn more.

## Using as a library

Nodeprompt can be used as a utility to obtain the status of the Git repository. Use the `model` property to build your own prompt or logger on top of the library:

```js
const Nodeprompt = require( './lib/nodeprompt.js' );
const prompt = new Nodeprompt();

console.log( prompt.model );

> {
	pwd: '/Users/oleq/nodeprompt',
	home: '/Users/oleq',
	gitDir: '.git',
	isGit: true,
	hostname: 'MBP',
	username: 'oleq',
	path: [ '~', 'nodeprompt' ],
	namerev: 'v1.0',
	head: 'ref: refs/heads/v1.0',
	hash: 'b22bb89',
	mergeHead: '',
	isInit: false,
	isBisecting: false,
	isDetached: false,
	isMerging: false,
	modified: 2,
	added: 0,
	untracked: 0,
	ahead: 2,
	behind: 0,
	branch: 'v1.0',
	hasDiverged: false
}
```

## Found a bug?

Create an issue [here](https://github.com/oleq/nodeprompt/issues).

## How to contribute?

Clone the repository to `/path/to/nodeprompt` and put `. /path/to/nodeprompt/bin/nodeprompt-bash` in your `~/.bashrc` or `~/.bash_profile` file. Source it or restart the terminal.

## License

MIT/X11. See the [LICENSE](LICENSE) file to know more.

## Misc

Kudos to [Leonid Volnitsky](https://github.com/lvv) for [git-prompt](https://github.com/lvv/git-prompt), an inspiration to create this project.

## Tests and development

* Call `npm run test` to run tests.
* Call `npm run coverage` to run tests with code coverage report in `./coverage`.
* Call `npm run lint` to run ESLint.
