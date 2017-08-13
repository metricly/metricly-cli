var zipFolder = new require('zip-folder');
var fs = require('fs');
var request = require('request-promise');

module.exports = function(config, logger, location) {
  logger.info('\nDeploying package');
  return createZip(location).then(zip => {
    return request.post({
      uri: config.endpoint + '/packages',
      qs: {
        tenantId: config.tenantId
      },
      formData: {
        file: fs.createReadStream(zip)
      }
    });
  }).then((body) => {
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
