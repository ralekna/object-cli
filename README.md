# object-cli

An utility to generate CLIs from object in Node.js

*Warning! This package in early stages of development and API may change any time*

## Usage


In file `myScript.js`

```javascript
const objectCli = require('object-cli');

objectCli({
  plus(val1, val2) {
    return val1 + val2;
  }
})

```

If you run `myScript.js` with node in console

`node myScript.js plus 1 2` it would print `3` to console.

## TODO:
- Interactive command execution
- special methods to handle STDIN

## Know issues
- Can't pass a class definition instead of object