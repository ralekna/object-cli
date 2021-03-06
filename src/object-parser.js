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


const {parseScript} = require('esprima');
const {generate} = require('escodegen');

function inheritedPropertyNames(obj) {
  if ((typeof obj) !== "object") { // null is not a problem
    throw new Error("Only objects are allowed");
  }
  const props = {};
  while(obj) {
    Object.getOwnPropertyNames(obj).forEach((name) => {
      if (Object.prototype[name] !== obj[name] && name !== 'constructor') {
        props[name] = true;
      }
    });
    obj = Object.getPrototypeOf(obj);
  }
  return Object.getOwnPropertyNames(props);
}

function parseObject(object) {
  return inheritedPropertyNames(object)
    .filter(key => object[key] && typeof object[key] === 'function' && key.indexOf('_') !== 0)
    .reduce((store, key) => (store[key] = getArguments(object[key]), store), {});
}

function getArguments(fn) {
  function maybe(x) {
    return x || {}; // optionals support
  }

  try {
    let fnSource = normalizeFunctionSource(fn.toString());
    const program = parseScript(fnSource);

    return program
      .body[0]
      .expression
      .params
      .map(function(node) {
        const name = (node.name || maybe(node.left).name || '...' + maybe(node.argument).name);
        const defaultValue = node.right ? generate(node.right) : undefined;
        return { name, defaultValue, isRest: name.indexOf('...') === 0 };
      });
  } catch (e) {
    return []; // could also return null
  }
}

function isAnonymousFunction(source) {
  return source.match(/^function\s*\(/);
}

function isArrowFunction(source) {
  return source.match(/^\(/);
}

function normalizeFunctionSource(source) {
  if (isAnonymousFunction(source)) {
    return `(${source})`;
  }
  if (!isArrowFunction(source)) { // is object's method
    return `(function ${source})`;
  }
  return source; // is arrow function
}

module.exports = {
  parseObject,
  normalizeFunctionSource
};