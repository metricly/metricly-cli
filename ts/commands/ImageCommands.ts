import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import ImageService from '../services/ImageService';

const configService = new ConfigService();
const imageService = new ImageService();

class ImageCommands {

  public static addCommands() {

    (caporal as any)
      .command('image custom delete', 'Delete a custom image')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<name>', 'Image Name')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        imageService.customtypeImageRm(args.name, config, logger);
      });

    (caporal as any)
      .command('image custom set', 'Set images for custom element types')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<name>', 'Image Name')
      .argument('<file>', 'Image File Name')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        imageService.customtypeImageSet(args.name, args.file, config, logger);
      });

    (caporal as any)
      .command('image custom list', 'List images for custom element types')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        imageService.customtypeImageList(config, logger);
      });
  }
}

export default ImageCommands;
