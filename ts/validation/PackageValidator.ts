import * as fs from 'fs';
import * as jsonValidator from 'json-dup-key-validator';

import DashboardValidator from './DashboardValidator';
import PolicyValidator from './PolicyValidator';
import AnalyticValidator from './AnalyticValidator';

import ErrorTracker from '../util/ErrorTracker';
import Logger from '../util/Logger';

class PackageValidator {

  private indent = '';
  private logger = new Logger(this.indent);

  private packageRepoRoot = 'https://github.com/netuitive-community-packages/';

  public validate(path: string, pkg: string, continueOnFinish = false): void {
    var dashboardValidator = new DashboardValidator();
    var policyValidator = new PolicyValidator();
    var analyticValidator = new AnalyticValidator();

    var errorTracker = new ErrorTracker(pkg, this.indent);

    this.logger.log('Package: ' + pkg);

    try {
      var json = fs.readFileSync(path + '/package.json', 'utf8');
      var jsonParseError = jsonValidator.validate(json, false);

      errorTracker.assertTrue(!jsonParseError, 'No duplicate object keys');

      var manifest = JSON.parse(json);
      var downloadUrl = manifest.manifest.distro.download;

      errorTracker.assertEquals(downloadUrl, this.packageRepoRoot + pkg.split('.').join('-') + '/archive/master.zip', 'Package download url is correct');

      var hasDashboards = fs.existsSync(path + '/dashboards');

      if (hasDashboards) {
        var dashboards = fs.readdirSync(path + '/dashboards/');
        dashboards.forEach(dashboard => {
          this.logger.log('  Dashboard: ' + dashboard);
          errorTracker.addErrors(dashboardValidator.validate(path + '/dashboards/', dashboard));
        });
      } else {
        this.logger.log('No dashboards, moving on');
      }

      var hasPolicies = fs.existsSync(path + '/policies');

      if (hasPolicies) {
        var policies = fs.readdirSync(path + '/policies/');
        errorTracker.assertEquals(policies.length.toString(), manifest.policies.length, 'Policy files are equal to the number of policies listed in package.json');

        policies.forEach(policy => {
          this.logger.log('  Policy: ' + policy);
          errorTracker.addErrors(policyValidator.validate(manifest.policies, path + '/policies/', policy));
        });
      } else {
        this.logger.log('No policies, moving on');
      }

      var hasAnalytics = fs.existsSync(path + '/analyticConfigurations');

      if (hasAnalytics) {
        var analytics = fs.readdirSync(path + '/analyticConfigurations/');
        errorTracker.assertEquals(analytics.length.toString(), manifest.analyticConfigurations.length, 'Analytic files are equal to the number of analytics listed in package.json');

        analytics.forEach(analytic => {
          this.logger.log('  Analytic: ' + analytic);
          errorTracker.addErrors(analyticValidator.validate(manifest.analyticConfigurations, path + '/analyticConfigurations/', analytic));
        });
      } else {
        this.logger.log('No analytics, moving on');
      }
    } catch (err) {
      errorTracker.log('Error: ' + err);
    }

    errorTracker.exit(continueOnFinish);
  }
}

export default PackageValidator;
