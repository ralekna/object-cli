const {parseScript} = require('esprima');
const {generate} = require('escodegen');

function parseObject(object) {
  return Object
    .keys(object)
    .filter(key => object.hasOwnProperty(key) && typeof object[key] === 'function')
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