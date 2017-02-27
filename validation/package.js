var fs = require('fs');
var dashboardValidation = require('./dashboards');

module.exports.validate = function(path, package) {
    console.log('------------------------------');
    console.log('Package: ' + package);

    var hasDashboards = fs.existsSync(path + '/dashboards');

    if (hasDashboards) {
      var dashboards = fs.readdirSync(path + '/dashboards/');
      dashboards.forEach(dashboard => {
        dashboardValidation.validate(path + '/dashboards/', dashboard);
      });
    } else {
      console.log('  No dashboards, moving on');
    }
};
