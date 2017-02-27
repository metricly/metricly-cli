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
    errorTracker.assertEquals(JSON.stringify(layoutIds), JSON.stringify(widgetIds), 'Layout IDs match widget IDs');

    var contents = dsb.dashboard.properties.gridstackContents;
    errorTracker.assertTrue(contents, 'Has gridstack contents');

    if (contents) {
      var gridstack = JSON.parse(contents);
      errorTracker.assertTrue(true, 'Gridstack content is valid JSON');

      var gridstackIds = gridstack.map(g => g.id).sort();
      errorTracker.assertEquals(JSON.stringify(gridstackIds), JSON.stringify(widgetIds), 'Gridstack layout contents match widget IDs');
    }
  } catch(err) {
    errorTracker.log('Error: ' + err);
  }
  return errorTracker.getErrors();
}
