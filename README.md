Nodeprompt &mdash; Pretty Git prompt for Bash
==================================================

## Requirements

* Bash (tested with 3.2.x).
* Node.js (tested with 0.10.x, 5.7.x).
* Git (tested with 1.9.x, 2.7.x).

## Demo

![Nodeprompt demo](demo/demo.gif?raw=true)

## Installation

1. Call `npm install -g nodeprompt`.
1. Put the following line

  ```
  . nodeprompt-enable
  ```

 in your `~/.bashrc` or `~/.bash_profile` file.
1. Re&ndash;open terminal window or source the file, i.e. `source ~/.bashrc`.
1. Enjoy your beautiful prompt!

## Configuration and customization

Nodeprompt is configurable, so things like the length of SHA-1 hash or the number of levels displayed in the path can be adjusted. It is also possible to create a new prompt template from scratch.

**Note**: You **don't** have to configure Nodeprompt. By default, it uses [`config.default.js`](https://github.com/oleq/nodeprompt/blob/master/config.default.js).

Config file is a plain Node.js module. To configure your prompt, create `~/.nodeprompt/config.user.js` file with `module.exports` declaration

```js
module.exports = {
    option: 'value'
};
```

or simply copy `config.default.js` there and modify it. Refer to documentation inside [`config.default.js`](https://github.com/oleq/nodeprompt/blob/master/config.default.js) to learn more.

## FAQ

1. **Q**: Why is data collected in Bash? Why not `require( 'child_process' ).exec`? Come on man, what's wrong with you?
 <br/> 
 **A**: Child Process is really, really slow and makes the prompt laggy. UX is the priority and, as long as Bash is faster, that's the right way to do it. I don't like it either.
2. **Q**: &lt;xyz&gt; sucks in `bin/nodeprompt-enable`. Why?
 <br/> 
 **A**: It's a Bash script. So what?

## License
 
MIT/X11. See the [LICENSE](LICENSE) file to know more.

## Misc

Kudos to [Leonid Volnitsky](https://github.com/lvv) for his [git-prompt](https://github.com/lvv/git-prompt), which was an inspiration.

## Tests

Call `npm test` to run tests.