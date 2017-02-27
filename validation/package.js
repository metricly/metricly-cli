var fs = require('fs');
var dashboardValidation = require('./dashboards');

module.exports.validate = function(path, package) {
    console.log('------------------------------');
    console.log('Package: ' + package);

    var hasDashboards = fs.existsSync(path + package + '/dashboards');

    if (hasDashboards) {
      var dashboards = fs.readdirSync(path + package + '/dashboards/');
      dashboards.forEach(dashboard => {
        dashboardValidation.validate(path + package + '/dashboards/', dashboard);
      });
    } else {
      console.log('  No dashboards, moving on');
    }
};
