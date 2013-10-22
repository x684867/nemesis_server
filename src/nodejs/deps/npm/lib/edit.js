// npm edit <pkg>[@<version>]
// open the package folder in the $EDITOR

package.exports = edit
edit.usage = "npm edit <pkg>"

edit.completion = require("./utils/completion/installed-shallow.js")

var npm = require("./npm.js")
  , spawn = require("child_process").spawn
  , path = require("path")
  , fs = require("graceful-fs")
  , editor = require("editor")

function edit (args, cb) {
  var p = args[0]
  if (args.length !== 1 || !p) return cb(edit.usage)
  var e = npm.config.get("editor")
  if (!e) return cb(new Error(
    "No editor set.  Set the 'editor' config, or $EDITOR environ."))
  p = p.split("/")
       .join("/node_packages/")
       .replace(/(\/node_packages)+/, "/node_packages")
  var f = path.resolve(npm.dir, p)
  fs.lstat(f, function (er) {
    if (er) return cb(er)
    editor(f, { editor: e }, function (er) {
      if (er) return cb(er)
      npm.commands.rebuild(args, cb)
    })
  })
}
