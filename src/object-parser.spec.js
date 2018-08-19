const {expect} = require('chai');
const {parseObject, normalizeFunctionSource} = require('./object-parser');

describe('object-parser', () => {

  describe('normalizeFunctionSource', () => {
    it('should normalize anonymous function source', () => {
      let result = normalizeFunctionSource('function (one, two) {}');
      expect(result).to.be.equal('(function (one, two) {})')
    });

    it('should normalize method source', () => {
      let result = normalizeFunctionSource('fn(one, two) {}');
      expect(result).to.be.equal('(function fn(one, two) {})')
    });

  });

  describe('parseObject', () => {

    it('should get no arguments', () => {
      let obj = parseObject({
        fn1() {

        },
        fn2: function() {

        },
        fn3: () => {

        }
      });
      expect(obj.fn1, 'method').to.be.an('array');
      expect(obj.fn1).to.have.lengthOf(0);
      expect(obj.fn2, 'anonymous').to.be.an('array');
      expect(obj.fn2).to.have.lengthOf(0);
      expect(obj.fn3, 'arrow').to.be.an('array');
      expect(obj.fn3).to.have.lengthOf(0);
    });

    it('should get functions arguments names', () => {
      let obj = parseObject({
        fn1(one, two) {

        },
        fn2: function(three, four) {

        },
        fn3: (five, six) => {

        }
      });
      expect(obj.fn1).to.be.an('array');
      expect(obj.fn1[0].name).to.be.equal('one');
      expect(obj.fn1[1].name).to.be.equal('two');
      expect(obj.fn2).to.be.an('array');
      expect(obj.fn2[0].name).to.be.equal('three');
      expect(obj.fn2[1].name).to.be.equal('four');
      expect(obj.fn3).to.be.an('array');
      expect(obj.fn3[0].name).to.be.equal('five');
      expect(obj.fn3[1].name).to.be.equal('six');
    });

    it('should get functions arguments names and their default primitive values', () => {
      let obj = parseObject({
        fn1(one = 1, two = 2) {

        },
        fn2: function(three = 3, four = 4) {

        },
        fn3: (five = 5, six = 6) => {

        }
      });
      expect(obj.fn1).to.be.an('array');
      expect(obj.fn1[0].defaultValue).to.be.equal('1');
      expect(obj.fn1[1].defaultValue).to.be.equal('2');
      expect(obj.fn2).to.be.an('array');
      expect(obj.fn2[0].defaultValue).to.be.equal('3');
      expect(obj.fn2[1].defaultValue).to.be.equal('4');
      expect(obj.fn3).to.be.an('array');
      expect(obj.fn3[0].defaultValue).to.be.equal('5');
      expect(obj.fn3[1].defaultValue).to.be.equal('6');

    });

    it('should get functions arguments names and their default complex values', () => {
      let obj = parseObject({
        fn0() {

        },
        fn1(one = new Date(), two = this.fn0()) {

        },
        fn2: function(three = 3/4*4, four = Math.sqrt(16)) {

        },
        fn3: (five = (() => 5)(), six = (function() { return 5; })()) => {

        }
      });
      expect(obj.fn1).to.be.an('array');
      expect(obj.fn1[0].defaultValue).to.be.equal('new Date()');
      expect(obj.fn1[1].defaultValue).to.be.equal('this.fn0()');
      expect(obj.fn2).to.be.an('array');
      expect(obj.fn2[0].defaultValue).to.be.equal('3 / 4 * 4');
      expect(obj.fn2[1].defaultValue).to.be.equal('Math.sqrt(16)');
      expect(obj.fn3).to.be.an('array');
      expect(obj.fn3[0].defaultValue).to.be.equal(`(() => 5)()`);
      expect(obj.fn3[1].defaultValue).to.be.equal(`function () {
    return 5;
}()`  );
    });


  });
});
