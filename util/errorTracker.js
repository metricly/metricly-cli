var Logger = require('./logger');

function ErrorTracker(object, indent) {
  this.object = object;
  this.indent = indent;
  this.logger = new Logger(indent);
  this.errors = [];
}

ErrorTracker.prototype.addErrors = function(additionalErrors) {
  this.errors = this.errors.concat(additionalErrors);
};

ErrorTracker.prototype.log = function(message) {
  this.errors.push(this.indent + this.object + ': ' + message);
  this.logger.log('Error: ' + message);
};

ErrorTracker.prototype.getErrors = function() {
  return this.errors;
};

ErrorTracker.prototype.exit = function(continueOnFinish) {
  if (this.errors.length === 0) {
    this.logger.log('Success! No errors ✓');
  } else {
    this.logger.log('Errors:');
    this.errors.forEach(error => console.log(error));
  }
  if (!continueOnFinish) {
    process.exit(this.errors.length === 0 ? 0 : 1);
  }
};

module.exports = ErrorTracker;
