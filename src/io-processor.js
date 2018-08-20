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

const _ = require('lodash');
const { evaluateInContext } = require('./function-executor');

function processCommand(instance, instanceMeta, args) {

  let commandName = _.first(args._);

  let methodArgumentsMeta = instanceMeta[commandName];
  if (methodArgumentsMeta) {
    return Promise
      .all(collectFunctionArguments(instance, methodArgumentsMeta, args))
      .then(functionArguments => {
        return instance[commandName].apply(instance, functionArguments);
      })
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(error => {
        console.error(`An error occurred while running command ${commandName}`, error);
      });
  } else {
    console.error(`Command ${commandName} not found.`);
    console.log(`Available commands: \n${Object.keys(instanceMeta).join('\n')}`);
    return Promise.reject();
  }

}

function collectFunctionArguments(instance, methodArgumentsMeta, args) {

  let freeArgs = args._.slice(1);

  return methodArgumentsMeta.map((argument, index) => {

    if (args[argument.name]) {
      return args[argument.name];
    } else if (freeArgs[0]) {
      const arg = freeArgs[0];
      freeArgs = freeArgs.slice(1);
      return arg;
    } else if (argument.defaultValue) {
      return evaluateInContext(argument.defaultValue, instance);
    }

    return undefined;

  });
}

module.exports = {
  processCommand
};