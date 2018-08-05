import * as archiver from 'archiver';
import * as clean from 'clean-deep';
import * as fs from 'fs';
import * as stringify from 'json-stable-stringify';
import * as request from 'request-promise';

class PackageService {

  private static PACKAGE_DIRECTORIES = ['dashboards', 'policies', 'analyticConfigurations'];

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

  public async createArchive(location: string, config, logger): Promise<void> {
    logger.debug('\nCreating archive package ');
    const output = fs.createWriteStream(location + '/pkg.zip');
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', () =>  {
      logger.info(archive.pointer() + ' total bytes archived');
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', () => {
      logger.debug('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', (err) =>  {
      if (err.code === 'ENOENT') {
        logger.warn(err);
      } else {
        // throw error
        throw err;
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', (err) =>  {
      throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);
    archive.directory(location, 'pkg-dir');
    archive.finalize();
  }

  public format(location: string, config, logger): void {
    PackageService.PACKAGE_DIRECTORIES.filter((dir) => {
      return fs.existsSync(`${location}/${dir}`);
    }).forEach((dir) => {
      fs.readdirSync(`${location}/${dir}`).forEach((file) => {
        logger.debug(`Formatting file ${location}/${dir}/${file}`);
        const contents = fs.readFileSync(`${location}/${dir}/${file}`, 'UTF8');
        fs.writeFileSync(`${location}/${dir}/${file}`, this.formatContent(contents));
      });
    });
    logger.info(`Done formatting the package at ${location}`);
  }

  public lint(location: string, config, logger): string[] {
    const errors: string[] = [];
    PackageService.PACKAGE_DIRECTORIES.filter((dir) => {
      return fs.existsSync(`${location}/${dir}`);
    }).forEach((dir) => {
      fs.readdirSync(`${location}/${dir}`).forEach((file) => {
        logger.debug(`Linting file ${location}/${dir}/${file}`);
        const contents = fs.readFileSync(`${location}/${dir}/${file}`, 'UTF8');
        if (contents !== this.formatContent(contents)) {
          errors.push(`${dir}/${file}`);
        }
      });
    });
    return errors;
  }

  private formatContent(content: string): string {
    return stringify(clean(JSON.parse(content.replace(/\"\[\]\"/g, '""'))), {
      space: 2
    });
  }
}

export default PackageService;
