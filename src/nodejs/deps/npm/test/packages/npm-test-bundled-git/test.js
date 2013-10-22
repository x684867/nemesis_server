var a = require("./node_packages/glob/node_packages/minimatch/package.json")
var e = require("./minimatch-expected.json")
var assert = require("assert")
assert.deepEqual(a, e, "didn't get expected minimatch/package.json")
