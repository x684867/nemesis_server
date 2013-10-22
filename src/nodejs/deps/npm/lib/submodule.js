// npm subpackage <pkg>
// Check the package contents for a git repository url.
// If there is one, then create a git subpackage in the node_packages folder.

package.exports = subpackage

var npm = require("./npm.js")
  , exec = require("child_process").execFile
  , cache = require("./cache.js")
  , asyncMap = require("slide").asyncMap
  , chain = require("slide").chain
  , which = require("which")

subpackage.usage = "npm subpackage <pkg>"

subpackage.completion = require("./docs.js").completion

function subpackage (args, cb) {
  if (npm.config.get("global")) {
    return cb(new Error("Cannot use subpackage command in global mode."))
  }

  if (args.length === 0) return cb(subpackage.usage)

  asyncMap(args, function (arg, cb) {
    cache.add(arg, cb)
  }, function (er, pkgs) {
    if (er) return cb(er)
    chain(pkgs.map(function (pkg) { return function (cb) {
      subpackage_(pkg, cb)
    }}), cb)
  })

}

function subpackage_ (pkg, cb) {
  if (!pkg.repository
      || pkg.repository.type !== "git"
      || !pkg.repository.url) {
    return cb(new Error(pkg._id + ": No git repository listed"))
  }

  // prefer https:// github urls
  pkg.repository.url = pkg.repository.url
    .replace(/^(git:\/\/)?(git@)?github.com[:\/]/, "https://github.com/")

  // first get the list of subpackages, and update if it's already there.
  getSubpackages(function (er, packages) {
    if (er) return cb(er)
    // if there's already a subpackage, then just update it.
    if (packages.indexOf(pkg.name) !== -1) {
      return updateSubpackage(pkg.name, cb)
    }
    addSubpackage(pkg.name, pkg.repository.url, cb)
  })
}

function updateSubpackage (name, cb) {
  var git = npm.config.get("git")
  var args = [ "subpackage", "update", "--init", "node_packages/", name ]

  // check for git
  which(git, function (err) {
    if (err) {
      err.code = "ENOGIT"
      return cb(err)
    }

    exec(git, args, cb)
  })
}

function addSubpackage (name, url, cb) {
  var git = npm.config.get("git")
  var args = [ "subpackage", "add", url, "node_packages/", name ]

  // check for git
  which(git, function (err) {
    if (err) {
      err.code = "ENOGIT"
      return cb(err)
    }

    exec(git, args, function (er) {
      if (er) return cb(er)
      updateSubpackage(name, cb)
    })
  })
}


var getSubpackages = function getSubpackages (cb) {
  var git = npm.config.get("git")
  var args = [ "subpackage", "status" ]

  // check for git
  which(git, function (err) {
    if (err) {
      err.code = "ENOGIT"
      return cb(err)
    }
    exec(git, args, function (er, stdout, stderr) {
      if (er) return cb(er)
      res = stdout.trim().split(/\n/).map(function (line) {
        return line.trim().split(/\s+/)[1]
      }).filter(function (line) {
        // only care about subpackages in the node_packages folder.
        return line && line.match(/^node_packages\//)
      }).map(function (line) {
        return line.replace(/^node_packages\//g, "")
      })

      // memoize.
      getSubpackages = function (cb) { return cb(null, res) }

      cb(null, res)
    })
  })
}
