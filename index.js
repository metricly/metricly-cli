var fs = require('fs');
var packageValidation = require('./validation/package');

var root = (process.argv.length === 3 ? process.argv[2] : '..') + '/';

const packages = fs.readdirSync(root).filter(f => fs.statSync(root + f).isDirectory() && f.startsWith('netuitive-packages-'));

packages.forEach(package => {
  packageValidation.validate(root + package, package);
});
