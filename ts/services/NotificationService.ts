import * as fs from 'fs';
import * as request from 'request-promise';

class NotificationService {

  public async list(config, logger): Promise<void> {
    logger.debug('\nListing notifications');
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/notifications'
      });
      if (config.format === 'text') {
        logger.info('The following notifications are available:');
        logger.info(response.notifications.sort((notify1, notify2) => {
          return notify1.type.localeCompare(notify2.type);
        }).map((notify) => {
          return notify.type + ': ' + notify.properties.name + ' (ID: ' + notify.id + ')';
        }));
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the notifications: ' + e);
    }
  }

  public async getById(id: string, config, logger): Promise<void> {
    logger.debug('\nGetting notification ' + id);
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/notifications/' + id
      });
      if (config.format === 'text') {
        logger.info(response.notification.properties.name + ' (TYPE: ' + response.notification.type + ', ID: ' + response.notification.id + ')');
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error getting the notification: ' + e);
    }
  }

  public async create(file: string, config, logger): Promise<void> {
    logger.debug('\nCreating notification');
    try {
      const notification = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        body: notification,
        json: true,
        method: 'POST',
        uri: config.endpoint + '/notifications'
      });
    } catch (e) {
      logger.error('There was an error creating the notification: ' + e);
    }
  }

  public async deleteById(id: string, config, logger): Promise<void> {
    logger.debug('\nDeleting notification ' + id);
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        method: 'DELETE',
        uri: config.endpoint + '/notifications/' + id
      });
    } catch (e) {
      logger.error('There was an error deleting the notification: ' + e);
    }
  }
}

export default NotificationService;
