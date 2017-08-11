var zipFolder = new require('zip-folder');

module.exports = function(config, logger, location) {
  logger.info('\nDeploying package');
  return createZip(location).then((zip) => {
    logger.info('\nDone deploying');
  });
};

function createZip(location) {
  var zip = './package.zip';
  return new Promise((resolve, reject) => {
    zipFolder(location, zip, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(zip);
      }
    });
  });
}
