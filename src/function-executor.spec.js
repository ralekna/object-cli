const {expect} = require('chai');
const {evaluateInContext} = require('./function-executor');

describe('function-executor', () => {
  describe('evaluateInContext', () => {
    it(`should execute source and return it's value`, () => {
      let obj = {
        x: 1
      };
      let result = evaluateInContext('this.x', obj);
      expect(result).to.be.equal(1);
    });
  });
});