var fs = require('fs');
var request = require('request-promise');

module.exports = {
  listInstalled: function(config, logger) {
    logger.debug('\nListing installed packages');
    return request({
      uri: config.endpoint + '/packages',
      auth: {
        user: config.username,
        pass: config.password
      }
    }).then(body => {
      logger.info('The following packages are installed:');
      logger.info(JSON.parse(body).packages.sort((pkg1, pkg2) => {
        return pkg1.name.localeCompare(pkg2.name);
      }).map(pkg => {
        return pkg.name + ':v' + pkg.version + ' (ID: ' + pkg.id + ')';
      }));
    });
  },

  getById: function(id, config, logger) {
    logger.debug('\nGetting package ' + id);
    return request({
      uri: config.endpoint + '/packages/' + id,
      auth: {
        user: config.username,
        pass: config.password
      }
    }).then(body => {
      var pkg = JSON.parse(body).package;
      logger.info(JSON.stringify(pkg, null, 2));
    });
  },

  uninstallById: function(id, config, logger) {
    logger.debug('\nUninstalling package ' + id);
    return request.delete({
      uri: config.endpoint + '/packages/' + id,
      auth: {
        user: config.username,
        pass: config.password
      }
    }).then(body => {
      logger.info('Successfully uninstalled package ' + id);
    });
  }
};
