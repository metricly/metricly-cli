function Logger(indent) {
  this.indent = indent;
}

Logger.prototype.log = function(message) {
  console.log(this.indent + message);
};

module.exports = Logger;
