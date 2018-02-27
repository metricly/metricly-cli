import * as fs from 'fs';
import * as request from 'request-promise';

class PackageService {

  public async listInstalled(config, logger): Promise<void> {
    logger.debug('\nListing installed packages');
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/packages'
      });
      logger.info('The following packages are installed:');
      logger.info(response.packages.sort((pkg1, pkg2) => {
        return pkg1.name.localeCompare(pkg2.name);
      }).map((pkg) => {
        return pkg.name + ':v' + pkg.version + ' (ID: ' + pkg.id + ')';
      }));
    } catch (e) {
      logger.error('There was an error listing the packages: ' + e);
    }
  }

  public async getById(id: string, config, logger): Promise<void> {
    logger.debug('\nGetting package ' + id);
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/packages/' + id
      });
      logger.info(JSON.stringify(response, null, 2));
    } catch (e) {
      logger.error('There was an error getting the package: ' + e);
    }
  }

  public async installFromUrl(url: string, config, logger): Promise<void> {
    logger.debug('\nInstalling package from ' + url);
    try {
      const body = await request.post({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: {
          archives: [url]
        },
        qs: {
          userEmail: config.username
        },
        uri: config.endpoint + '/packages/'
      });
      logger.info('Successfully installed package, ID: ' + body.packages[0].id);
    } catch (e) {
      logger.error('There was an error installing the package: ' + e);
    }
  }

  public async installFromFile(file: string, config, logger): Promise<void> {
    logger.info('\nThe following package ' + file + ' will be installed.');

    logger.debug('\nUploading package ');
    try {
        const fd = {
            file: fs.createReadStream(file)
        };
        const response = await request.post({
            auth: {
              pass: config.password,
              user: config.username
            },
            formData: fd,
            uri: config.endpoint + '/packages/install'
        });

        logger.info('Installed package from file: ' + file);
    } catch (e) {
        logger.error('There was an error installing the packages: ', e);
    }
  }

  public async uninstallById(id: string, config, logger): Promise<void> {
    logger.debug('\nUninstalling package ' + id);
    try {
      const body = await request.delete({
        auth: {
          pass: config.password,
          user: config.username
        },
        uri: config.endpoint + '/packages/' + id
      });
      logger.info('Successfully uninstalled package ' + id);
    } catch (e) {
      logger.error('There was an error uninstalling the package: ' + e);
    }
  }
}

export default PackageService;
