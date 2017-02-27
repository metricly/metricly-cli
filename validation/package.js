var fs = require('fs');
var ErrorTracker = require('../util/errorTracker');
var dashboardValidation = require('./dashboards');
var policyValidation = require('./policies');

var indent = '';

var Logger = require('../util/logger');
var logger = new Logger(indent);

var packageRepoRoot = 'https://github.com/netuitive-community-packages/';

module.exports.validate = function(path, package, continueOnFinish) {
    var errorTracker = new ErrorTracker(package, indent);

    logger.log('Package: ' + package);

    try {
      var manifest = JSON.parse(fs.readFileSync(path + '/package.json', 'utf8'));
      var downloadUrl = manifest.manifest.distro.download;

      errorTracker.assertEquals(downloadUrl,  packageRepoRoot + package.split('.').join('-') + '/archive/master.zip', 'Package download url is correct');

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

      var hasPolicies = fs.existsSync(path + '/policies');

      if (hasPolicies) {
        var policies = fs.readdirSync(path + '/policies/');
        errorTracker.assertEquals(policies.length, manifest.policies.length, 'Policy files are equal to the number of policies listed in package.json');

        policies.forEach(policy => {
          logger.log('  Policy: ' + policy);
          errorTracker.addErrors(policyValidation.validate(manifest.policies, path + '/policies/', policy));
        });
      } else {
        logger.log('No policies, moving on');
      }
    } catch (err) {
      errorTracker.log('Error: ' + err);
    }

    errorTracker.exit(continueOnFinish);
};
