import * as extend from 'extend';
import * as fs from 'fs';

class CommandUtils {

  public static mergeConfig(options) {
    const location = process.env.HOME + '/.metricly-cli.json';
    const config = fs.existsSync(location) ? JSON.parse((fs.readFileSync(location).toString())) : {};
    return extend({}, config, options);
  }
}

export default CommandUtils;
