var fs = require('fs');
var jsonValidator = require('json-dup-key-validator');

var ErrorTracker = require('../util/errorTracker');
var dashboardValidation = require('./dashboards');
var policyValidation = require('./policies');
var analyticValidation = require('./analytics');

var indent = '';

var Logger = require('../util/logger');
var logger = new Logger(indent);

var packageRepoRoot = 'https://github.com/netuitive-community-packages/';

module.exports.validate = function(path, package, continueOnFinish) {
    var errorTracker = new ErrorTracker(package, indent);

    logger.log('Package: ' + package);

    try {
      var json = fs.readFileSync(path + '/package.json', 'utf8');
      var jsonParseError = jsonValidator.validate(json, false);

      errorTracker.assertTrue(!jsonParseError, 'No duplicate object keys');

      var manifest = JSON.parse(json);
      var downloadUrl = manifest.manifest.distro.download;

      errorTracker.assertEquals(downloadUrl,  packageRepoRoot + package.split('.').join('-') + '/archive/master.zip', 'Package download url is correct');

      var dashboardFiles = manifest.dashboards;
      if (dashboardFiles) {
        logger.log('  Dashboard files');
        dashboardFiles.forEach(dsb => {
          errorTracker.assertTrue(fs.existsSync(path + '/' + dsb.data.file), '    Dashboard file ' + dsb.data.file + ' exists');
        });
      }

      var hasDashboards = fs.existsSync(path + '/dashboards');

      if (hasDashboards) {
        var dashboards = fs.readdirSync(path + '/dashboards/');
        dashboards.forEach(dashboard => {
          logger.log('  Dashboard: ' + dashboard);
          errorTracker.assertTrue(dashboardFiles.filter(dsb => dsb.data.file === 'dashboards/' + dashboard).length === 1, '    Dashboard file ' + dashboard + ' exists in the manifest');
          errorTracker.addErrors(dashboardValidation.validate(path + '/dashboards/', dashboard));
        });
      } else {
        logger.log('No dashboards, moving on');
      }

      var policyFiles = manifest.policies;
      if (policyFiles) {
        logger.log('  Policy files');
        policyFiles.forEach(pol => {
          errorTracker.assertTrue(fs.existsSync(path + '/' + pol.data.file), '    Policy file ' + pol.data.file + ' exists');
        });
      }

      var hasPolicies = fs.existsSync(path + '/policies');

      if (hasPolicies) {
        var policies = fs.readdirSync(path + '/policies/');
        policies.forEach(policy => {
          logger.log('  Policy: ' + policy);
          errorTracker.assertTrue(policyFiles.filter(pol => pol.data.file === 'policies/' + policy).length === 1, '    Policy file ' + policy + ' exists in the manifest');
          errorTracker.addErrors(policyValidation.validate(manifest.policies, path + '/policies/', policy));
        });
      } else {
        logger.log('No policies, moving on');
      }

      var hasAnalytics = fs.existsSync(path + '/analyticConfigurations');

      if (hasAnalytics) {
        var analytics = fs.readdirSync(path + '/analyticConfigurations/');
        errorTracker.assertEquals(analytics.length, manifest.analyticConfigurations.length, 'Analytic files are equal to the number of analytics listed in package.json');

        analytics.forEach(analytic => {
          logger.log('  Analytic: ' + analytic);
          errorTracker.addErrors(analyticValidation.validate(manifest.analyticConfigurations, path + '/analyticConfigurations/', analytic));
        });
      } else {
        logger.log('No analytics, moving on');
      }
    } catch (err) {
      errorTracker.log('Error: ' + err);
    }

    errorTracker.exit(continueOnFinish);
};
