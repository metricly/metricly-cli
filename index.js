var fs = require('fs');
var dashboardValidation = require('./validation/dashboards');

var root = (process.argv.length === 3 ? process.argv[2] : '..') + '/';

const packages = fs.readdirSync(root).filter(f => fs.statSync(root + f).isDirectory() && f.startsWith('netuitive-packages-'));

packages.forEach(package => {
  console.log('------------------------------');
  console.log('Package: ' + package);

  var hasDashboards = fs.existsSync(root + package + '/dashboards');

  if (hasDashboards) {
    var dashboards = fs.readdirSync(root + package + '/dashboards/');
    dashboards.forEach(dashboard => {
      dashboardValidation.validate(root + package + '/dashboards/', dashboard);
    });
  } else {
    console.log('  No dashboards, moving on');
  }
});
