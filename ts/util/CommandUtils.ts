import * as extend from 'extend';
import * as fs from 'fs';

class CommandUtils {

  public static getConfig() {
    const location = process.env.HOME + '/.metricly-cli.json';
    return fs.existsSync(location) ? JSON.parse((fs.readFileSync(location).toString())) : {};
  }

  public static mergeConfig(options) {
    const config = this.getConfig();
    return extend({}, config[options.profile], options);
  }

  public static saveConfig(config) {
    const location = process.env.HOME + '/.metricly-cli.json';
    fs.writeFileSync(location, JSON.stringify(config, null, 2));
  }
}

export default CommandUtils;
