import * as fs from 'fs';
import * as jsonValidator from 'json-dup-key-validator';

import ErrorTracker from '../util/ErrorTracker';
import Logger from '../util/Logger';

class policyValidator {

  private indent = '    ';
  private logger = new Logger(this.indent);

  public validate(policyList: any[], location: string, policy: string): string[] {
    var errorTracker = new ErrorTracker(policy, this.indent);

    try {
      var json = fs.readFileSync(location + policy, 'utf8');
      var jsonParseError = jsonValidator.validate(json, false);

      errorTracker.assertTrue(!jsonParseError, 'No duplicate object keys');

      var pol = JSON.parse(json);

      errorTracker.assertTrue(true, 'Policy is valid JSON');

      errorTracker.assertTrue((pol.policy.scope.elementType && typeof pol.policy.scope.elementType === 'string') || (pol.policy.scope.elementTypes && Array.isArray(pol.policy.scope.elementTypes)), 'Policy has a valid elementType(s)');

      errorTracker.assertTrue(policyList.filter(policyItem => policyItem.data.file === 'policies/' + policy).length === 1, 'Policy found in package.json list');
    } catch(err) {
      errorTracker.log('Error: ' + err);
    }
    return errorTracker.getErrors();
  }
}

export default policyValidator;
