const objectCli = require('./../../src/index');

objectCli(
  class Calculator {
    plus(val1, val2) {
      return val1 + val2;
    }
    pow(num, degree = 2) {
      return num * degree;
    }
    _youCannotCallMeFromCommandLine() {

    }
  }
);