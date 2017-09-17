import * as fs from 'fs';
import * as request from 'request-promise';
import * as Bluebird from 'bluebird';

class PackageService {

  public listInstalled(config, logger): Bluebird<void> {
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
    }).catch(e => {
      logger.error('There was an error listing the packages');
    });
  }

  public getById(id: string, config, logger) {
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
    }).catch(e => {
      logger.error('There was an error getting the package');
    });
  }

  public installFromUrl(url: string, config, logger): Bluebird<void> {
    logger.debug('\nInstalling package from ' + url);
    return request.post({
      uri: config.endpoint + '/packages/',
      auth: {
        user: config.username,
        pass: config.password
      },
      json: {
        archives: [url]
      },
      qs: {
        userEmail: config.username
      }
    }).then(body => {
      logger.info('Successfully installed package, ID: ' + body.packages[0].id);
    }).catch(e => {
      logger.error('There was an error installing the package');
    });
  }

  public uninstallById(id: string, config, logger): Bluebird<void> {
    logger.debug('\nUninstalling package ' + id);
    return request.delete({
      uri: config.endpoint + '/packages/' + id,
      auth: {
        user: config.username,
        pass: config.password
      }
    }).then(body => {
      logger.info('Successfully uninstalled package ' + id);
    }).catch(e => {
      logger.error('There was an error uninstalling the package');
    });
  }
}

export default PackageService;
