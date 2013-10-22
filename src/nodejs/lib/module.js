// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Nativepackage = require('native_package');
var util = Nativepackage.require('util');
var runInThisContext = require('vm').runInThisContext;
var runInNewContext = require('vm').runInNewContext;
var assert = require('assert').ok;


// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}


function package(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (parent && parent.children) {
    parent.children.push(this);
  }

  this.filename = null;
  this.loaded = false;
  this.children = [];
}
package.exports = package;

// Set the environ variable NODE_package_CONTEXTS=1 to make node load all
// packages in their own context.
package._contextLoad = (+process.env['NODE_package_CONTEXTS'] > 0);
package._cache = {};
package._pathCache = {};
package._extensions = {};
var packagePaths = [];
package.globalPaths = [];

package.wrapper = Nativepackage.wrapper;
package.wrap = Nativepackage.wrap;

var path = Nativepackage.require('path');

package._debug = util.debuglog('package');


// We use this alias for the preprocessor that filters it out
var debug = package._debug;


// given a package name, and a list of paths to test, returns the first
// matching file in the following precedence.
//
// require("a.<ext>")
//   -> a.<ext>
//
// require("a")
//   -> a
//   -> a.<ext>
//   -> a/index.<ext>

function statPath(path) {
  var fs = Nativepackage.require('fs');
  try {
    return fs.statSync(path);
  } catch (ex) {}
  return false;
}

// check if the directory is a package.json dir
var packageCache = {};

function readPackage(requestPath) {
  if (hasOwnProperty(packageCache, requestPath)) {
    return packageCache[requestPath];
  }

  var fs = Nativepackage.require('fs');
  try {
    var jsonPath = path.resolve(requestPath, 'package.json');
    var json = fs.readFileSync(jsonPath, 'utf8');
  } catch (e) {
    return false;
  }

  try {
    var pkg = packageCache[requestPath] = JSON.parse(json);
  } catch (e) {
    e.path = jsonPath;
    e.message = 'Error parsing ' + jsonPath + ': ' + e.message;
    throw e;
  }
  return pkg;
}

function tryPackage(requestPath, exts) {
  var pkg = readPackage(requestPath);

  if (!pkg || !pkg.main) return false;

  var filename = path.resolve(requestPath, pkg.main);
  return tryFile(filename) || tryExtensions(filename, exts) ||
         tryExtensions(path.resolve(filename, 'index'), exts);
}

// In order to minimize unnecessary lstat() calls,
// this cache is a list of known-real paths.
// Set to an empty object to reset.
package._realpathCache = {};

// check if the file exists and is not a directory
function tryFile(requestPath) {
  var fs = Nativepackage.require('fs');
  var stats = statPath(requestPath);
  if (stats && !stats.isDirectory()) {
    return fs.realpathSync(requestPath, package._realpathCache);
  }
  return false;
}

// given a path check a the file exists with any of the set extensions
function tryExtensions(p, exts) {
  for (var i = 0, EL = exts.length; i < EL; i++) {
    var filename = tryFile(p + exts[i]);

    if (filename) {
      return filename;
    }
  }
  return false;
}


package._findPath = function(request, paths) {
  var exts = Object.keys(package._extensions);

  if (request.charAt(0) === '/') {
    paths = [''];
  }

  var trailingSlash = (request.slice(-1) === '/');

  var cacheKey = JSON.stringify({request: request, paths: paths});
  if (package._pathCache[cacheKey]) {
    return package._pathCache[cacheKey];
  }

  // For each path
  for (var i = 0, PL = paths.length; i < PL; i++) {
    var basePath = path.resolve(paths[i], request);
    var filename;

    if (!trailingSlash) {
      // try to join the request to the path
      filename = tryFile(basePath);

      if (!filename && !trailingSlash) {
        // try it with each of the extensions
        filename = tryExtensions(basePath, exts);
      }
    }

    if (!filename) {
      filename = tryPackage(basePath, exts);
    }

    if (!filename) {
      // try it with each of the extensions at "index"
      filename = tryExtensions(path.resolve(basePath, 'index'), exts);
    }

    if (filename) {
      package._pathCache[cacheKey] = filename;
      return filename;
    }
  }
  return false;
};

// 'from' is the __dirname of the package.
package._nodepackagePaths = function(from) {
  // guarantee that 'from' is absolute.
  from = path.resolve(from);

  // note: this approach *only* works when the path is guaranteed
  // to be absolute.  Doing a fully-edge-case-correct path.split
  // that works on both Windows and Posix is non-trivial.
  var splitRe = process.platform === 'win32' ? /[\/\\]/ : /\//;
  var paths = [];
  var parts = from.split(splitRe);

  for (var tip = parts.length - 1; tip >= 0; tip--) {
    // don't search in .../node_packages/node_packages
    if (parts[tip] === 'node_packages') continue;
    var dir = parts.slice(0, tip + 1).concat('node_packages').join(path.sep);
    paths.push(dir);
  }

  return paths;
};


package._resolveLookupPaths = function(request, parent) {
  if (Nativepackage.exists(request)) {
    return [request, []];
  }

  var start = request.substring(0, 2);
  if (start !== './' && start !== '..') {
    var paths = packagePaths;
    if (parent) {
      if (!parent.paths) parent.paths = [];
      paths = parent.paths.concat(paths);
    }
    return [request, paths];
  }

  // with --eval, parent.id is not set and parent.filename is null
  if (!parent || !parent.id || !parent.filename) {
    // make require('./path/to/foo') work - normally the path is taken
    // from realpath(__filename) but with eval there is no filename
    var mainPaths = ['.'].concat(packagePaths);
    mainPaths = package._nodepackagePaths('.').concat(mainPaths);
    return [request, mainPaths];
  }

  // Is the parent an index package?
  // We can assume the parent has a valid extension,
  // as it already has been accepted as a package.
  var isIndex = /^index\.\w+?$/.test(path.basename(parent.filename));
  var parentIdPath = isIndex ? parent.id : path.dirname(parent.id);
  var id = path.resolve(parentIdPath, request);

  // make sure require('./path') and require('path') get distinct ids, even
  // when called from the toplevel js file
  if (parentIdPath === '.' && id.indexOf('/') === -1) {
    id = './' + id;
  }

  debug('RELATIVE: requested:' + request +
        ' set ID to: ' + id + ' from ' + parent.id);

  return [id, [path.dirname(parent.filename)]];
};


package._load = function(request, parent, isMain) {
  if (parent) {
    debug('package._load REQUEST  ' + (request) + ' parent: ' + parent.id);
  }

  var filename = package._resolveFilename(request, parent);

  var cachedpackage = package._cache[filename];
  if (cachedpackage) {
    return cachedpackage.exports;
  }

  if (Nativepackage.exists(filename)) {
    // REPL is a special case, because it needs the real require.
    if (filename == 'repl') {
      var replpackage = new package('repl');
      replpackage._compile(Nativepackage.getSource('repl'), 'repl.js');
      Nativepackage._cache.repl = replpackage;
      return replpackage.exports;
    }

    debug('load native package ' + request);
    return Nativepackage.require(filename);
  }

  var package = new package(filename, parent);

  if (isMain) {
    process.mainpackage = package;
    package.id = '.';
  }

  package._cache[filename] = package;

  var hadException = true;

  try {
    package.load(filename);
    hadException = false;
  } finally {
    if (hadException) {
      delete package._cache[filename];
    }
  }

  return package.exports;
};

package._resolveFilename = function(request, parent) {
  if (Nativepackage.exists(request)) {
    return request;
  }

  var resolvedpackage = package._resolveLookupPaths(request, parent);
  var id = resolvedpackage[0];
  var paths = resolvedpackage[1];

  // look up the filename first, since that's the cache key.
  debug('looking for ' + JSON.stringify(id) +
        ' in ' + JSON.stringify(paths));

  var filename = package._findPath(request, paths);
  if (!filename) {
    var err = new Error("Cannot find package '" + request + "'");
    err.code = 'package_NOT_FOUND';
    throw err;
  }
  return filename;
};


package.prototype.load = function(filename) {
  debug('load ' + JSON.stringify(filename) +
        ' for package ' + JSON.stringify(this.id));

  assert(!this.loaded);
  this.filename = filename;
  this.paths = package._nodepackagePaths(path.dirname(filename));

  var extension = path.extname(filename) || '.js';
  if (!package._extensions[extension]) extension = '.js';
  package._extensions[extension](this, filename);
  this.loaded = true;
};


package.prototype.require = function(path) {
  assert(util.isString(path), 'path must be a string');
  assert(path, 'missing path');
  return package._load(path, this);
};


// Resolved path to process.argv[1] will be lazily placed here
// (needed for setting breakpoint when called with --debug-brk)
var resolvedArgv;


// Returns exception if any
package.prototype._compile = function(content, filename) {
  var self = this;
  // remove shebang
  content = content.replace(/^\#\!.*/, '');

  function require(path) {
    return self.require(path);
  }

  require.resolve = function(request) {
    return package._resolveFilename(request, self);
  };

  Object.defineProperty(require, 'paths', { get: function() {
    throw new Error('require.paths is removed. Use ' +
                    'node_packages folders, or the NODE_PATH ' +
                    'environment variable instead.');
  }});

  require.main = process.mainpackage;

  // Enable support to add extra extension types
  require.extensions = package._extensions;
  require.registerExtension = function() {
    throw new Error('require.registerExtension() removed. Use ' +
                    'require.extensions instead.');
  };

  require.cache = package._cache;

  var dirname = path.dirname(filename);

  if (package._contextLoad) {
    if (self.id !== '.') {
      debug('load subpackage');
      // not root package
      var sandbox = {};
      for (var k in global) {
        sandbox[k] = global[k];
      }
      sandbox.require = require;
      sandbox.exports = self.exports;
      sandbox.__filename = filename;
      sandbox.__dirname = dirname;
      sandbox.package = self;
      sandbox.global = sandbox;
      sandbox.root = root;

      return runInNewContext(content, sandbox, { filename: filename });
    }

    debug('load root package');
    // root package
    global.require = require;
    global.exports = self.exports;
    global.__filename = filename;
    global.__dirname = dirname;
    global.package = self;

    return runInThisContext(content, { filename: filename });
  }

  // create wrapper function
  var wrapper = package.wrap(content);

  var compiledWrapper = runInThisContext(wrapper, { filename: filename });
  if (global.v8debug) {
    if (!resolvedArgv) {
      // we enter the repl if we're not given a filename argument.
      if (process.argv[1]) {
        resolvedArgv = package._resolveFilename(process.argv[1], null);
      } else {
        resolvedArgv = 'repl';
      }
    }

    // Set breakpoint on package start
    if (filename === resolvedArgv) {
      global.v8debug.Debug.setBreakPoint(compiledWrapper, 0, 0);
    }
  }
  var args = [self.exports, require, self, filename, dirname];
  return compiledWrapper.apply(self.exports, args);
};


function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}


// Native extension for .js
package._extensions['.js'] = function(package, filename) {
  var content = Nativepackage.require('fs').readFileSync(filename, 'utf8');
  package._compile(stripBOM(content), filename);
};


// Native extension for .json
package._extensions['.json'] = function(package, filename) {
  var content = Nativepackage.require('fs').readFileSync(filename, 'utf8');
  try {
    package.exports = JSON.parse(stripBOM(content));
  } catch (err) {
    err.message = filename + ': ' + err.message;
    throw err;
  }
};


//Native extension for .node
package._extensions['.node'] = process.dlopen;


// bootstrap main package.
package.runMain = function() {
  // Load the main package--the command line argument.
  package._load(process.argv[1], null, true);
  // Handle any nextTicks added in the first tick of the program
  process._tickCallback();
};

package._initPaths = function() {
  var isWindows = process.platform === 'win32';

  if (isWindows) {
    var homeDir = process.env.USERPROFILE;
  } else {
    var homeDir = process.env.HOME;
  }

  var paths = [path.resolve(process.execPath, '..', '..', 'lib', 'node')];

  if (homeDir) {
    paths.unshift(path.resolve(homeDir, '.node_libraries'));
    paths.unshift(path.resolve(homeDir, '.node_packages'));
  }

  if (process.env['NODE_PATH']) {
    paths = process.env['NODE_PATH'].split(path.delimiter).concat(paths);
  }

  packagePaths = paths;

  // clone as a read-only copy, for introspection.
  package.globalPaths = packagePaths.slice(0);
};

// bootstrap repl
package.requireRepl = function() {
  return package._load('repl', '.');
};

package._initPaths();

// backwards compatibility
package.package = package;
