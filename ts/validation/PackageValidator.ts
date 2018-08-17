import * as fs from 'fs';
import * as jsonValidator from 'json-dup-key-validator';

import AnalyticValidator from './AnalyticValidator';
import DashboardValidator from './DashboardValidator';
import PolicyValidator from './PolicyValidator';

import ErrorTracker from '../util/ErrorTracker';
import Logger from '../util/Logger';

class PackageValidator {

  private indent = '';
  private logger = new Logger(this.indent);

  private packageRepoRoot = 'https://github.com/netuitive-community-packages/';

  public validate(path: string, pkg: string, continueOnFinish = false): void {
    const dashboardValidator = new DashboardValidator();
    const policyValidator = new PolicyValidator();
    const analyticValidator = new AnalyticValidator();

    const errorTracker = new ErrorTracker(pkg, this.indent);

    this.logger.log('Package: ' + pkg);

    const validJsonMessage = 'Manifest is valid JSON';
    try {
      const json = fs.readFileSync(path + '/package.json', 'utf8');

      const manifest = JSON.parse(json);
      errorTracker.assertTrue(true, validJsonMessage);

      const jsonParseError = jsonValidator.validate(json, false);
      errorTracker.assertTrue(!jsonParseError, 'No duplicate object keys');

      const downloadUrl = manifest.manifest.distro.download;

      const zipUrl = this.packageRepoRoot + pkg.split('.').join('-') + '/archive/master.zip';
      errorTracker.assertEquals(downloadUrl, zipUrl, 'Package download url is correct');

      const hasDashboards = fs.existsSync(path + '/dashboards');

      if (hasDashboards) {
        const dashboards = fs.readdirSync(path + '/dashboards/');
        dashboards.forEach((dashboard) => {
          this.logger.log('  Dashboard: ' + dashboard);
          errorTracker.addErrors(dashboardValidator.validate(path + '/dashboards/', dashboard));
        });
      } else {
        this.logger.log('No dashboards, moving on');
      }

      const hasPolicies = fs.existsSync(path + '/policies');

      if (hasPolicies) {
        const policies = fs.readdirSync(path + '/policies/');
        // tslint:disable-next-line:max-line-length
        errorTracker.assertEquals(policies.length, manifest.policies.length, 'Policy files are equal to the number of policies listed in package.json');

        policies.forEach((policy) => {
          this.logger.log('  Policy: ' + policy);
          errorTracker.addErrors(policyValidator.validate(manifest.policies, path + '/policies/', policy));
        });
      } else {
        this.logger.log('No policies, moving on');
      }

      const hasAnalytics = fs.existsSync(path + '/analyticConfigurations');

      if (hasAnalytics) {
        const analytics = fs.readdirSync(path + '/analyticConfigurations/');
        // tslint:disable-next-line:max-line-length
        errorTracker.assertEquals(analytics.length, manifest.analyticConfigurations.length, 'Analytic files are equal to the number of analytics listed in package.json');

        analytics.forEach((analytic) => {
          this.logger.log('  Analytic: ' + analytic);
        // tslint:disable-next-line:max-line-length
          errorTracker.addErrors(analyticValidator.validate(manifest.analyticConfigurations, path + '/analyticConfigurations/', analytic));
        });
      } else {
        this.logger.log('No analytics, moving on');
      }
    } catch (err) {
      if (err.name === 'SyntaxError') {
        errorTracker.assertTrue(false, validJsonMessage);
      } else {
        errorTracker.log(err);
      }
    }

    errorTracker.exit(continueOnFinish);
  }
}

export default PackageValidator;
