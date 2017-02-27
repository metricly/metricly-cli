var fs = require('fs');
var ErrorTracker = require('../util/errorTracker');

var indent = '    ';

var Logger = require('../util/logger');
var logger = new Logger(indent);

module.exports = {
  validate
};

function validate(location, dashboard) {
  var errorTracker = new ErrorTracker(dashboard, indent);

  try {
    var dsb = JSON.parse(fs.readFileSync(location + dashboard, 'utf8'));

    var widgetIds = dsb.dashboard.widgets.map(w => w.id).sort();
    var layoutIds = [].concat.apply([], JSON.parse(dsb.dashboard.layout).contents.map(c => c.widgets)).sort();
    logger.log('Layout IDs match widget IDs: ' + (JSON.stringify(widgetIds) == JSON.stringify(layoutIds) ? '✓' : 'X'));
    if (JSON.stringify(widgetIds) != JSON.stringify(layoutIds)) {
      errorTracker.log('Layout contents do not match the widget IDs');
      logger.log('  Widget IDs: ' + JSON.stringify(widgetIds));
      logger.log('  Layout IDs: ' + JSON.stringify(layoutIds));
    }

    var contents = dsb.dashboard.properties.gridstackContents;
    logger.log('Has gridstack: ' + (contents ? '✓' : 'X'));

    if (contents) {
      var gridstack = JSON.parse(contents);
      logger.log('Gridstack content is valid JSON: ✓');

      var gridstackIds = gridstack.map(g => g.id).sort();
      logger.log('Gridstack layout IDs match widget IDs: ' + (JSON.stringify(widgetIds) == JSON.stringify(gridstackIds) ? '✓' : 'X'));
      if (JSON.stringify(widgetIds) != JSON.stringify(gridstackIds)) {
        errorTracker.log('Gridstack layout contents do not match the widget IDs');
        logger.log('  Widget IDs: ' + JSON.stringify(widgetIds));
        logger.log('  Gridstack IDs: ' + JSON.stringify(gridstackIds));
      }
    } else {
      errorTracker.log('No Gridstack contents');
    }
  } catch(err) {
    errorTracker.log('Error: ' + err);
  }
  return errorTracker.getErrors();
}
