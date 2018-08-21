# object-cli

An utility to generate CLIs from object in Node.js

*Warning! This package in early stages of development and API may change any time*

## Usage


### Simple

In file `myScript.js`

```javascript
const objectCli = require('object-cli');

objectCli({
  plus(val1, val2) {
    return val1 + val2;
  },
  pow(num, degree = 2) {
    return num * degree;
  },
  _youCannotCallMeFromCommandLine() {
    
  }
})

```

If you run `myScript.js` with node in console

`node myScript.js plus 1 2` it would print `3` to console.

`node myScript.js plus --val1 1 --val2 2` would do same too.

`node myScript.js pow 3` it would print `9` to console (second param `degree` would default to `2`).

If your method returns primitive value then it will be printed out. 
If you want to output more information you can always use `console.log()` for that. 

If a method starts with underscore `_` then it will be invisible from command-line.

## TODO:
- Support default command
- Recognize commands in kebab-case
- Support rest params
- special methods to handle STDIN
- Interactive command execution
