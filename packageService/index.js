var request = require('request-promise');

module.exports = {
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
