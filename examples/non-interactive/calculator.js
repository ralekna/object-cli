const objectCli = require('./../../src/index');

objectCli(class Calculator {
  plus(val1, val2) {
    return val1 + val2;
  }
});