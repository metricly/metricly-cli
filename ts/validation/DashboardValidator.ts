import * as fs from 'fs';
import * as jsonValidator from 'json-dup-key-validator';

import ErrorTracker from '../util/ErrorTracker';
import Logger from '../util/Logger';

class DashboardValidator {

  private indent = '    ';
  private logger = new Logger(this.indent);

  public validate(location: string, dashboard: string): string[] {
    const errorTracker = new ErrorTracker(dashboard, this.indent);

    const validJsonMessage = 'Dashboard is valid JSON';
    try {
      const json = fs.readFileSync(location + dashboard, 'utf8');

      const dsb = JSON.parse(json);
      errorTracker.assertTrue(true, validJsonMessage);

      const jsonParseError = jsonValidator.validate(json, false);
      errorTracker.assertTrue(!jsonParseError, 'No duplicate object keys');

      const widgetIds = dsb.dashboard.widgets.map((w) => w.id).sort();
      const widgetNames = dsb.dashboard.widgets.map((w) => w.name).sort();

      errorTracker.assertTrue([...new Set(widgetNames)].length === widgetIds.length, 'No duplicate widget names');

      if (dsb.dashboard.layout && JSON.parse(dsb.dashboard.layout)) {
        const layoutIds = [].concat.apply([], JSON.parse(dsb.dashboard.layout).contents.map((c) => c.widgets)).sort();
        errorTracker.assertEquals(JSON.stringify(layoutIds), JSON.stringify(widgetIds), 'Layout IDs match widget IDs');
      }

      const contents = dsb.dashboard.properties.gridstackContents;
      errorTracker.assertTrue(contents, 'Has gridstack contents');

      if (contents) {
        const validGridstackJsonMessage = 'Gridstack content is valid JSON';
        try {
          const gridstack = JSON.parse(contents);
          errorTracker.assertTrue(true, validGridstackJsonMessage);

          const gridstackIds = gridstack.map((g) => g.id).sort();
          // tslint:disable-next-line:max-line-length
          errorTracker.assertEquals(JSON.stringify(gridstackIds), JSON.stringify(widgetIds), 'Gridstack layout contents match widget IDs');
        } catch (e) {
          if (e.name === 'SyntaxError') {
            errorTracker.assertTrue(false, validGridstackJsonMessage);
          } else {
            throw e;
          }
        }
      }
    } catch (err) {
      if (err.name === 'SyntaxError') {
        errorTracker.assertTrue(false, validJsonMessage);
      } else {
        errorTracker.log(err);
      }
    }
    return errorTracker.getErrors();
  }
}

export default DashboardValidator;
