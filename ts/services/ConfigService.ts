import * as fs from 'fs';
import * as inquirer from 'inquirer';

class ConfigService {
    /**
     * Prompt user for configuration
     * @param config A possible previous configuration
     * @param logger
     */
    public doConfigInquiry(config, logger) {
        inquirer.prompt([{
            default: config.username,
            message: 'Metricly Username',
            name: 'username',
            type: 'input'
          }, {
            default: config.password,
            message: 'Metricly Password',
            name: 'password',
            type: 'password'
          }, {
            default: config.endpoint || 'https://app.netuitive.com',
            message: 'Metricly Endpoint',
            name: 'endpoint',
            type: 'input'
          }]).then((answers) => {
            const location = process.env.HOME + '/.metricly-cli.json';
            fs.writeFileSync(location, JSON.stringify(answers, null, 2));
          });
    }
}

export default ConfigService;
