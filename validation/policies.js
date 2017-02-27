var fs = require('fs');
var ErrorTracker = require('../util/errorTracker');

var indent = '    ';

var Logger = require('../util/logger');
var logger = new Logger(indent);

module.exports = {
  validate
};

function validate(location, policy) {
  var errorTracker = new ErrorTracker(policy, indent);

  try {
    var pol = JSON.parse(fs.readFileSync(location + policy, 'utf8'));

    errorTracker.assertTrue(true, 'Policy is valid JSON');
  } catch(err) {
    errorTracker.log('Error: ' + err);
  }
  return errorTracker.getErrors();
}
