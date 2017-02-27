var fs = require('fs');
var dashboardValidation = require('./dashboards');

var Logger = require('../util/logger');
var logger = new Logger('');

module.exports.validate = function(path, package) {
    logger.log('------------------------------');
    logger.log('Package: ' + package);

    var hasDashboards = fs.existsSync(path + '/dashboards');

    if (hasDashboards) {
      var dashboards = fs.readdirSync(path + '/dashboards/');
      dashboards.forEach(dashboard => {
        dashboardValidation.validate(path + '/dashboards/', dashboard);
      });
    } else {
      logger.log('No dashboards, moving on');
    }
};
