import * as fs from 'fs';
import * as jsonValidator from 'json-dup-key-validator';

import ErrorTracker from '../util/ErrorTracker';
import Logger from '../util/Logger';

class AnalyticValidator {

  private indent = '    ';
  private logger = new Logger(this.indent);

  public validate(analyticsList: any[], location: string, analytic: string): string[] {
    var errorTracker = new ErrorTracker(analytic, this.indent);

    try {
      var json = fs.readFileSync(location + analytic, 'utf8');
      var jsonParseError = jsonValidator.validate(json, false);

      errorTracker.assertTrue(!jsonParseError, 'No duplicate object keys');

      var ana = JSON.parse(json);

      errorTracker.assertTrue(true, 'Analytic is valid JSON');

      errorTracker.assertTrue(analyticsList.filter(analyticItem => analyticItem.data.file === 'analyticConfigurations/' + analytic).length === 1, 'Analytic found in package.json list');
    } catch(err) {
      errorTracker.log('Error: ' + err);
    }
    return errorTracker.getErrors();
  }
}

export default AnalyticValidator;
