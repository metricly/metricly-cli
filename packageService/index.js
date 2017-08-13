var zipFolder = new require('zip-folder');
var fs = require('fs');
var request = require('request-promise');

module.exports = {
  deploy: function(config, logger, location) {
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
  },

  listInstalled: function(config, logger) {
    logger.debug('\nListing installed packages');
    return request({
      uri: config.endpoint + '/packages',
      qs: {
        tenantId: config.tenantId
      }
    }).then(body => {
      logger.info('The following packages are installed:');
      logger.info(JSON.parse(body).packages.sort((pkg1, pkg2) => {
        return pkg1.name.localeCompare(pkg2.name);
      }).map(pkg => {
        return pkg.name + ':' + pkg.version + ' (ID: ' + pkg.packageId + ')';
      }));
    });
  }
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
