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

const parseArgs = require('minimist');
const { parseObject } = require('./object-parser');
const { processCommand } = require('./io-processor');

function createInstance(object) {
  if (object && typeof object !== 'function' && object === Object(object) && !Array.isArray(object)) {
    // TODO: decide if there's a need to save initial instance
    return object;
  } else if (typeof object === 'function') {
    try {
      return createInstance(new object());
    } catch (error) {
      if (error instanceof TypeError) {
        return createInstance(object());
        // not caching here - let it break execution
      }
    }
  }
  throw new Error(`Only object, class or function can by supplied.`);

}

/**
 * Initialize object for CLI interface
 * @param object  object from which to create a CLI interface. In can be a plain object, class instance, class definition (will be )
 * @param [args]
 */
function init(object, args) {

  let instance = createInstance(object);
  let instanceMeta = parseObject(instance);

  let parsedArgs = parseArgs(args || process.argv.slice(2));

  return processCommand(instance, instanceMeta, parsedArgs);

}

module.exports = init;