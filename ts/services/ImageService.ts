import * as fs from 'fs';
import * as request from 'request-promise';

class ImageService {

  public async customtypeImageRm(imageName, config, logger): Promise<void> {
    logger.info('\nDelete a custom image ' + imageName);
    try {
      const response = await this.deleteCustomImage(config, logger, imageName);
      if (config.format === 'text') {
        logger.info(response);
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }

    } catch (e) {
      logger.error('There was an error deleting the image: ' + e);
    }
  }

  public async deleteCustomImage(config, logger, name) {
    const uriString = `${config.endpoint}/images/ELEMENT_TYPE/${name}`;
    logger.debug('Delete image with URI: ' + uriString);
    const response = await request({
      auth: {
        pass: config.password,
        user: config.username
      },
      json: true,
      method: 'DELETE',
      uri: uriString
    });
    return response;
  }

  public async customtypeImageSet(imageName, file: string, config, logger): Promise<void> {
    logger.info('\nThe following image ' + file + ' will be saved under a name ' + imageName);

    logger.debug('\nUploading image ');
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
            uri: config.endpoint + '/images/ELEMENT_TYPE/' + imageName
        });

        logger.info('Set image from file: ' + file);
    } catch (e) {
        logger.error('There was an error setting the image: ', e);
    }
  }

  public async customtypeImageList(config, logger): Promise<void> {
    logger.debug('\nListing images for custom element types');
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/images'
      });
      if (config.format === 'text') {
        logger.info('The following images are installed:');
        logger.info(response.sort((img1, img2) => {
          return img1.name.localeCompare(img2.name);
        }).map((img) => {
          return img.name + ' (url: ' + img.url + ')';
        }));
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the images: ' + e);
    }
  }
}

export default ImageService;
