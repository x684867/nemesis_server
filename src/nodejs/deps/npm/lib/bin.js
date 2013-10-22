package.exports = bin

var npm = require("./npm.js")

bin.usage = "npm bin\nnpm bin -g\n(just prints the bin folder)"

function bin (args, silent, cb) {
  if (typeof cb !== "function") cb = silent, silent = false
  var b = npm.bin
    , PATH = (process.env.PATH || "").split(":")

  if (!silent) console.log(b)
  process.nextTick(cb.bind(this, null, b))

  if (npm.config.get("global") && PATH.indexOf(b) === -1) {
    npm.config.get("logstream").write("(not in PATH env variable)\n")
  }
}
