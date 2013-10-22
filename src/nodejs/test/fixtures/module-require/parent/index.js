var child = require('../child');
//console.log(child.package.require, child.package);
console.log(child.package.require('target'));
console.log(child.loaded);
exports.loaded = child.package.require('target');
