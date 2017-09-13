var fs = require('fs');
var jsonValidator = require('json-dup-key-validator');

var ErrorTracker = require('../util/errorTracker');

var indent = '    ';

var Logger = require('../util/logger');
var logger = new Logger(indent);

module.exports = {
  validate
};

function validate(analyticsList, location, analytic) {
  var errorTracker = new ErrorTracker(analytic, indent);

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
