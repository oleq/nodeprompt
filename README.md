Nodeprompt &mdash; Pretty Git prompt for Bash
==================================================

## Requirements

* Bash 3.2.x
* [Fish](https://fishshell.com/) 2.5.x (experimental)
* [Node.js](https://nodejs.org/) (tested with 0.10.x, 5.7.x, 6.9.x).
* [Git](https://git-scm.com/) (tested with 1.9.x, 2.7.x, 2.11.x, 2.14.x).

**Note:** There is a good change Nodeprompt will work with other configurations — just give it a shot and let me know!

## Demo

![Nodeprompt demo](demo/demo.gif?raw=true)

## Installation

### Bash

1. Call `npm install -g nodeprompt` first.
1. Put the following line

   ```bash
   . nodeprompt-enable
   ```

   in your `~/.bashrc` or `~/.bash_profile` file.
1. Re&ndash;open the terminal window or source the file, i.e. `source ~/.bashrc`.
1. Enjoy your beautiful prompt!

### Fish (experimental)

1. Locate the path to the package (`npm install -g nodeprompt`) in your OS or [clone Nodeprompt](#how-to-contribute) from GitHub.
1. Create a symlink to the fish script:
   ```bash
   ln -s path/to/nodeprompt/bin/fish_prompt.fish ~/.config/fish/functions/fish_prompt.fish
   ```
1. Re&ndash;open the terminal window.
1. Enjoy your beautiful prompt!

## Configuration and customization

Nodeprompt is configurable and things like the length of the SHA-1 hash or the number of levels displayed in the path can be adjusted. It is also possible to create a new prompt template from scratch, if that's what you want to do tonight.

**Note**: You **don't** have to configure Nodeprompt. By default, it uses [`config.default.js`](https://github.com/oleq/nodeprompt/blob/master/config.default.js).

Config file is a plain Node.js module. To configure your prompt, create a `~/.nodeprompt/config.user.js` file with `module.exports` declaration

```js
module.exports = {
    option: 'value'
};
```

or simply copy `config.default.js` there and modify it. Refer to documentation inside [`config.default.js`](https://github.com/oleq/nodeprompt/blob/master/config.default.js) to learn more.

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
   path: '~/nodeprompt',
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

Clone the repository to `/path/to/nodeprompt` and put `. /path/to/nodeprompt/bin/nodeprompt-enable` in your `~/.bashrc` or `~/.bash_profile` file. Source it or restart the terminal.

## License

MIT/X11. See the [LICENSE](LICENSE) file to know more.

## Misc

Kudos to [Leonid Volnitsky](https://github.com/lvv) for [git-prompt](https://github.com/lvv/git-prompt), an inspiration to create this project.

## Tests

* Call `npm run test` to run tests.
* Call `npm run coverage` to run tests with code coverage report in `./coverage`.
