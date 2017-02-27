var fs = require('fs');
var ErrorTracker = require('../util/errorTracker');
var dashboardValidation = require('./dashboards');

var indent = '';

var Logger = require('../util/logger');
var logger = new Logger(indent);

module.exports.validate = function(path, package, continueOnFinish) {
    var errorTracker = new ErrorTracker(package, indent);

    logger.log('------------------------------');
    logger.log('Package: ' + package);

    var hasDashboards = fs.existsSync(path + '/dashboards');

    if (hasDashboards) {
      var dashboards = fs.readdirSync(path + '/dashboards/');
      dashboards.forEach(dashboard => {
        logger.log('  Dashboard: ' + dashboard);
        errorTracker.addErrors(dashboardValidation.validate(path + '/dashboards/', dashboard));
      });
    } else {
      logger.log('No dashboards, moving on');
    }

    errorTracker.exit(continueOnFinish);
};
