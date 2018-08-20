/**
 MIT License

 Copyright (c) 2018 Rytis Alekna <r.alekna@gmail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

const {expect} = require('chai');
const init = require('./index');

describe('object-cli', () => {
  describe('init', () => {

    it(`should execute function on given object with provided args array`, async () => {
      let result = await init({
        plus(first, second) {
          return first + second;
        }
      }, ['plus', '1', '2']);

      expect(result).to.be.equal(3);
    });

    it(`should execute function on given object with provided named args`, async () => {
      let result = await init({
        plus(first, second) {
          return first + second;
        }
      }, ['plus', '--first', '1', '--second', '2']);

      expect(result).to.be.equal(3);
    });

    it(`should execute function on given object with one provided named arg and one free`, async () => {
      let result = await init({
        plus(first, second) {
          return first + second;
        }
      }, ['plus', '1', '--second', '2']);

      expect(result).to.be.equal(3);
    });

    it(`should execute function on given object with default params`, async () => {
      let result = await init({
        plus(first = 1, second = 2) {
          return first + second;
        }
      }, ['plus']);

      expect(result).to.be.equal(3);
    });

  });
});
