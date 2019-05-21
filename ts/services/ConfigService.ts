import * as extend from 'extend';
import * as fs from 'fs';
import EncryptionUtil from '../util/EncryptionUtil';

class ConfigService {

  public getConfig() {
    const location = this.getLocation();
    return fs.existsSync(location) ? JSON.parse((fs.readFileSync(location).toString())) : {};
  }

  public mergeConfig(options) {
    const config = this.getConfig();
    if (config[options.profile]) {
      config[options.profile].password = EncryptionUtil.decrypt(config[options.profile].password);
    }
    return extend({}, config[options.profile], options);
  }

  public saveConfig(config) {
    fs.writeFileSync(this.getLocation(), JSON.stringify(config, null, 2));
  }

  private getLocation(): string {
    return (process.env.HOME || (process.env.HOMEDRIVE + process.env.HOMEPATH)) + '/.metricly-cli.json';
  }
}

export default ConfigService;
