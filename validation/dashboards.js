var fs = require('fs');

var Logger = require('../util/logger');
var logger = new Logger('  ');

module.exports = {
  validate
};

function validate(location, dashboard) {
  logger.log('Dashboard: ' + dashboard);

  try {
    logger = new Logger('    ');
    var dsb = JSON.parse(fs.readFileSync(location + dashboard, 'utf8'));

    var widgetIds = dsb.dashboard.widgets.map(w => w.id).sort();
    var layoutIds = [].concat.apply([], JSON.parse(dsb.dashboard.layout).contents.map(c => c.widgets)).sort();
    logger.log('Layout IDs match widget IDs: ' + (JSON.stringify(widgetIds) == JSON.stringify(layoutIds) ? '✓' : 'X'));
    if (JSON.stringify(widgetIds) != JSON.stringify(layoutIds)) {
      logger.log('      Widget IDs: ' + JSON.stringify(widgetIds));
      logger.log('      Layout IDs: ' + JSON.stringify(layoutIds));
    }

    var contents = dsb.dashboard.properties.gridstackContents;
    logger.log('Has gridstack: ' + (contents ? '✓' : 'X'));

    if (contents) {
      var gridstack = JSON.parse(contents);
      logger.log('Gridstack content is valid JSON: ✓');

      var gridstackIds = gridstack.map(g => g.id).sort();
      logger.log('Gridstack layout IDs match widget IDs: ' + (JSON.stringify(widgetIds) == JSON.stringify(gridstackIds) ? '✓' : 'X'));
      if (JSON.stringify(widgetIds) != JSON.stringify(gridstackIds)) {
        logger.log('      Widget IDs: ' + JSON.stringify(widgetIds));
        logger.log('      Gridstack IDs: ' + JSON.stringify(gridstackIds));
      }
    }
  } catch(err) {
    logger.log('    Error: ' + err);
  }
}
