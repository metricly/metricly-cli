import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import NotificationService from '../services/NotificationService';

const configService = new ConfigService();
const notificationService = new NotificationService();

class NotificationCommands {

  public static addCommands() {
    (caporal as any)
      .command('notification list', 'List all notifications')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        notificationService.list(config, logger);
      });

    (caporal as any)
      .command('notification get', 'Get a notification by ID')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<id>', 'Notification ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        notificationService.getById(args.id, config, logger);
      });

    (caporal as any)
      .command('notification create', 'Create a new notification from a local JSON file')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .argument('<file>', 'JSON notification file location')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        notificationService.create(args.file, config, logger);
      });

    (caporal as any)
      .command('notification delete', 'Delete a notification by ID')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Notification ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        notificationService.deleteById(args.id, config, logger);
      });
  }
}

export default NotificationCommands;
