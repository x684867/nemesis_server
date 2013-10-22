# packages

    Stability: 5 - Locked

<!--name=package-->

Node has a simple package loading system.  In Node, files and packages are in
one-to-one correspondence.  As an example, `foo.js` loads the package
`circle.js` in the same directory.

The contents of `foo.js`:

    var circle = require('./circle.js');
    console.log( 'The area of a circle of radius 4 is '
               + circle.area(4));

The contents of `circle.js`:

    var PI = Math.PI;

    exports.area = function (r) {
      return PI * r * r;
    };

    exports.circumference = function (r) {
      return 2 * PI * r;
    };

The package `circle.js` has exported the functions `area()` and
`circumference()`.  To export an object, add to the special `exports`
object.

Note that `exports` is a reference to `package.exports` making it suitable
for augmentation only. If you are exporting a single item such as a
constructor you will want to use `package.exports` directly instead.

    function MyConstructor (opts) {
      //...
    }

    // BROKEN: Does not modify exports
    exports = MyConstructor;

    // exports the constructor properly
    package.exports = MyConstructor;

Variables
local to the package will be private. In this example the variable `PI` is
private to `circle.js`.

The package system is implemented in the `require("package")` package.

## Cycles

<!--type=misc-->

When there are circular `require()` calls, a package might not be
done being executed when it is returned.

Consider this situation:

`a.js`:

    console.log('a starting');
    exports.done = false;
    var b = require('./b.js');
    console.log('in a, b.done = %j', b.done);
    exports.done = true;
    console.log('a done');

`b.js`:

    console.log('b starting');
    exports.done = false;
    var a = require('./a.js');
    console.log('in b, a.done = %j', a.done);
    exports.done = true;
    console.log('b done');

`main.js`:

    console.log('main starting');
    var a = require('./a.js');
    var b = require('./b.js');
    console.log('in main, a.done=%j, b.done=%j', a.done, b.done);

When `main.js` loads `a.js`, then `a.js` in turn loads `b.js`.  At that
point, `b.js` tries to load `a.js`.  In order to prevent an infinite
loop an **unfinished copy** of the `a.js` exports object is returned to the
`b.js` package.  `b.js` then finishes loading, and its `exports` object is
provided to the `a.js` package.

By the time `main.js` has loaded both packages, they're both finished.
The output of this program would thus be:

    $ node main.js
    main starting
    a starting
    b starting
    in b, a.done = false
    b done
    in a, b.done = true
    a done
    in main, a.done=true, b.done=true

If you have cyclic package dependencies in your program, make sure to
plan accordingly.

## Core packages

<!--type=misc-->

Node has several packages compiled into the binary.  These packages are
described in greater detail elsewhere in this documentation.

The core packages are defined in node's source in the `lib/` folder.

Core packages are always preferentially loaded if their identifier is
passed to `require()`.  For instance, `require('http')` will always
return the built in HTTP package, even if there is a file by that name.

## File packages

<!--type=misc-->

If the exact filename is not found, then node will attempt to load the
required filename with the added extension of `.js`, `.json`, and then `.node`.

`.js` files are interpreted as JavaScript text files, and `.json` files are
parsed as JSON text files. `.node` files are interpreted as compiled addon
packages loaded with `dlopen`.

A package prefixed with `'/'` is an absolute path to the file.  For
example, `require('/home/marco/foo.js')` will load the file at
`/home/marco/foo.js`.

A package prefixed with `'./'` is relative to the file calling `require()`.
That is, `circle.js` must be in the same directory as `foo.js` for
`require('./circle')` to find it.

Without a leading '/' or './' to indicate a file, the package is either a
"core package" or is loaded from a `node_packages` folder.

If the given path does not exist, `require()` will throw an Error with its
`code` property set to `'package_NOT_FOUND'`.

## Loading from `node_packages` Folders

<!--type=misc-->

If the package identifier passed to `require()` is not a native package,
and does not begin with `'/'`, `'../'`, or `'./'`, then node starts at the
parent directory of the current package, and adds `/node_packages`, and
attempts to load the package from that location.

If it is not found there, then it moves to the parent directory, and so
on, until the root of the tree is reached.

For example, if the file at `'/home/ry/projects/foo.js'` called
`require('bar.js')`, then node would look in the following locations, in
this order:

* `/home/ry/projects/node_packages/bar.js`
* `/home/ry/node_packages/bar.js`
* `/home/node_packages/bar.js`
* `/node_packages/bar.js`

This allows programs to localize their dependencies, so that they do not
clash.

## Folders as packages

<!--type=misc-->

It is convenient to organize programs and libraries into self-contained
directories, and then provide a single entry point to that library.
There are three ways in which a folder may be passed to `require()` as
an argument.

The first is to create a `package.json` file in the root of the folder,
which specifies a `main` package.  An example package.json file might
look like this:

    { "name" : "some-library",
      "main" : "./lib/some-library.js" }

If this was in a folder at `./some-library`, then
`require('./some-library')` would attempt to load
`./some-library/lib/some-library.js`.

This is the extent of Node's awareness of package.json files.

If there is no package.json file present in the directory, then node
will attempt to load an `index.js` or `index.node` file out of that
directory.  For example, if there was no package.json file in the above
example, then `require('./some-library')` would attempt to load:

* `./some-library/index.js`
* `./some-library/index.node`

## Caching

<!--type=misc-->

packages are cached after the first time they are loaded.  This means
(among other things) that every call to `require('foo')` will get
exactly the same object returned, if it would resolve to the same file.

Multiple calls to `require('foo')` may not cause the package code to be
executed multiple times.  This is an important feature.  With it,
"partially done" objects can be returned, thus allowing transitive
dependencies to be loaded even when they would cause cycles.

If you want to have a package execute code multiple times, then export a
function, and call that function.

### package Caching Caveats

<!--type=misc-->

packages are cached based on their resolved filename.  Since packages may
resolve to a different filename based on the location of the calling
package (loading from `node_packages` folders), it is not a *guarantee*
that `require('foo')` will always return the exact same object, if it
would resolve to different files.

## The `package` Object

<!-- type=var -->
<!-- name=package -->

* {Object}

In each package, the `package` free variable is a reference to the object
representing the current package.  In particular
`package.exports` is accessible via the `exports` package-global.
`package` isn't actually a global but rather local to each package.

### package.exports

* {Object}

The `package.exports` object is created by the package system. Sometimes this is not
acceptable, many want their package to be an instance of some class. To do this
assign the desired export object to `package.exports`. For example suppose we
were making a package called `a.js`

    var EventEmitter = require('events').EventEmitter;

    package.exports = new EventEmitter();

    // Do some work, and after some time emit
    // the 'ready' event from the package itself.
    setTimeout(function() {
      package.exports.emit('ready');
    }, 1000);

Then in another file we could do

    var a = require('./a');
    a.on('ready', function() {
      console.log('package a is ready');
    });


Note that assignment to `package.exports` must be done immediately. It cannot be
done in any callbacks.  This does not work:

x.js:

    setTimeout(function() {
      package.exports = { a: "hello" };
    }, 0);

y.js:

    var x = require('./x');
    console.log(x.a);


### package.require(id)

* `id` {String}
* Return: {Object} `package.exports` from the resolved package

The `package.require` method provides a way to load a package as if
`require()` was called from the original package.

Note that in order to do this, you must get a reference to the `package`
object.  Since `require()` returns the `package.exports`, and the `package` is
typically *only* available within a specific package's code, it must be
explicitly exported in order to be used.


### package.id

* {String}

The identifier for the package.  Typically this is the fully resolved
filename.


### package.filename

* {String}

The fully resolved filename to the package.


### package.loaded

* {Boolean}

Whether or not the package is done loading, or is in the process of
loading.


### package.parent

* {package Object}

The package that required this one.


### package.children

* {Array}

The package objects required by this one.



## All Together...

<!-- type=misc -->

To get the exact filename that will be loaded when `require()` is called, use
the `require.resolve()` function.

Putting together all of the above, here is the high-level algorithm
in pseudocode of what require.resolve does:

    require(X) from package at path Y
    1. If X is a core package,
       a. return the core package
       b. STOP
    2. If X begins with './' or '/' or '../'
       a. LOAD_AS_FILE(Y + X)
       b. LOAD_AS_DIRECTORY(Y + X)
    3. LOAD_NODE_packageS(X, dirname(Y))
    4. THROW "not found"

    LOAD_AS_FILE(X)
    1. If X is a file, load X as JavaScript text.  STOP
    2. If X.js is a file, load X.js as JavaScript text.  STOP
    3. If X.node is a file, load X.node as binary addon.  STOP

    LOAD_AS_DIRECTORY(X)
    1. If X/package.json is a file,
       a. Parse X/package.json, and look for "main" field.
       b. let M = X + (json main field)
       c. LOAD_AS_FILE(M)
    2. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
    3. If X/index.node is a file, load X/index.node as binary addon.  STOP

    LOAD_NODE_packageS(X, START)
    1. let DIRS=NODE_packageS_PATHS(START)
    2. for each DIR in DIRS:
       a. LOAD_AS_FILE(DIR/X)
       b. LOAD_AS_DIRECTORY(DIR/X)

    NODE_packageS_PATHS(START)
    1. let PARTS = path split(START)
    2. let ROOT = index of first instance of "node_packages" in PARTS, or 0
    3. let I = count of PARTS - 1
    4. let DIRS = []
    5. while I > ROOT,
       a. if PARTS[I] = "node_packages" CONTINUE
       c. DIR = path join(PARTS[0 .. I] + "node_packages")
       b. DIRS = DIRS + DIR
       c. let I = I - 1
    6. return DIRS

## Loading from the global folders

<!-- type=misc -->

If the `NODE_PATH` environment variable is set to a colon-delimited list
of absolute paths, then node will search those paths for packages if they
are not found elsewhere.  (Note: On Windows, `NODE_PATH` is delimited by
semicolons instead of colons.)

Additionally, node will search in the following locations:

* 1: `$HOME/.node_packages`
* 2: `$HOME/.node_libraries`
* 3: `$PREFIX/lib/node`

Where `$HOME` is the user's home directory, and `$PREFIX` is node's
configured `node_prefix`.

These are mostly for historic reasons.  You are highly encouraged to
place your dependencies locally in `node_packages` folders.  They will be
loaded faster, and more reliably.

## Accessing the main package

<!-- type=misc -->

When a file is run directly from Node, `require.main` is set to its
`package`. That means that you can determine whether a file has been run
directly by testing

    require.main === package

For a file `foo.js`, this will be `true` if run via `node foo.js`, but
`false` if run by `require('./foo')`.

Because `package` provides a `filename` property (normally equivalent to
`__filename`), the entry point of the current application can be obtained
by checking `require.main.filename`.

## Addenda: Package Manager Tips

<!-- type=misc -->

The semantics of Node's `require()` function were designed to be general
enough to support a number of sane directory structures. Package manager
programs such as `dpkg`, `rpm`, and `npm` will hopefully find it possible to
build native packages from Node packages without modification.

Below we give a suggested directory structure that could work:

Let's say that we wanted to have the folder at
`/usr/lib/node/<some-package>/<some-version>` hold the contents of a
specific version of a package.

Packages can depend on one another. In order to install package `foo`, you
may have to install a specific version of package `bar`.  The `bar` package
may itself have dependencies, and in some cases, these dependencies may even
collide or form cycles.

Since Node looks up the `realpath` of any packages it loads (that is,
resolves symlinks), and then looks for their dependencies in the
`node_packages` folders as described above, this situation is very simple to
resolve with the following architecture:

* `/usr/lib/node/foo/1.2.3/` - Contents of the `foo` package, version 1.2.3.
* `/usr/lib/node/bar/4.3.2/` - Contents of the `bar` package that `foo`
  depends on.
* `/usr/lib/node/foo/1.2.3/node_packages/bar` - Symbolic link to
  `/usr/lib/node/bar/4.3.2/`.
* `/usr/lib/node/bar/4.3.2/node_packages/*` - Symbolic links to the packages
  that `bar` depends on.

Thus, even if a cycle is encountered, or if there are dependency
conflicts, every package will be able to get a version of its dependency
that it can use.

When the code in the `foo` package does `require('bar')`, it will get the
version that is symlinked into `/usr/lib/node/foo/1.2.3/node_packages/bar`.
Then, when the code in the `bar` package calls `require('quux')`, it'll get
the version that is symlinked into
`/usr/lib/node/bar/4.3.2/node_packages/quux`.

Furthermore, to make the package lookup process even more optimal, rather
than putting packages directly in `/usr/lib/node`, we could put them in
`/usr/lib/node_packages/<name>/<version>`.  Then node will not bother
looking for missing dependencies in `/usr/node_packages` or `/node_packages`.

In order to make packages available to the node REPL, it might be useful to
also add the `/usr/lib/node_packages` folder to the `$NODE_PATH` environment
variable.  Since the package lookups using `node_packages` folders are all
relative, and based on the real path of the files making the calls to
`require()`, the packages themselves can be anywhere.
