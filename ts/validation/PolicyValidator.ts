import * as fs from 'fs';
import * as jsonValidator from 'json-dup-key-validator';

import ErrorTracker from '../util/ErrorTracker';
import Logger from '../util/Logger';

class PolicyValidator {

  private indent = '    ';
  private logger = new Logger(this.indent);

  public validate(policyList: any[], location: string, policy: string): string[] {
    const errorTracker = new ErrorTracker(policy, this.indent);

    const validJsonMessage = 'Policy is valid JSON';
    try {
      const json = fs.readFileSync(location + policy, 'utf8');

      const pol = JSON.parse(json);
      errorTracker.assertTrue(true, validJsonMessage);

      const jsonParseError = jsonValidator.validate(json, false);
      errorTracker.assertTrue(!jsonParseError, 'No duplicate object keys');

      const stringElementType = pol.policy.scope.elementType && typeof pol.policy.scope.elementType === 'string';
      const arrayElementTypes = pol.policy.scope.elementTypes && Array.isArray(pol.policy.scope.elementTypes);
      errorTracker.assertTrue(stringElementType || arrayElementTypes, 'Policy has a valid elementType(s)');

      const policies = policyList.filter((policyItem) => policyItem.data.file === 'policies/' + policy);
      errorTracker.assertTrue(policies.length === 1, 'Policy found in package.json list');
    } catch (err) {
      if (err.name === 'SyntaxError') {
        errorTracker.assertTrue(false, validJsonMessage);
      } else {
        errorTracker.log(err);
      }
    }
    return errorTracker.getErrors();
  }
}

export default PolicyValidator;
