var fs = require('fs');

module.exports = {
  validate
};

function validate(location, dashboard) {
  console.log('  Dashboard: ' + dashboard);

  try {
    var dsb = JSON.parse(fs.readFileSync(location + dashboard, 'utf8'));

    var widgetIds = dsb.dashboard.widgets.map(w => w.id).sort();
    var layoutIds = [].concat.apply([], JSON.parse(dsb.dashboard.layout).contents.map(c => c.widgets)).sort();
    console.log('    Layout IDs match widget IDs: ' + (JSON.stringify(widgetIds) == JSON.stringify(layoutIds) ? '✓' : 'X'));
    if (JSON.stringify(widgetIds) != JSON.stringify(layoutIds)) {
      console.log('      Widget IDs: ' + JSON.stringify(widgetIds));
      console.log('      Layout IDs: ' + JSON.stringify(layoutIds));
    }

    var contents = dsb.dashboard.properties.gridstackContents;
    console.log('    Has gridstack: ' + (contents ? '✓' : 'X'));

    if (contents) {
      var gridstack = JSON.parse(contents);
      console.log('    Gridstack content is valid JSON: ✓');

      var gridstackIds = gridstack.map(g => g.id).sort();
      console.log('    Gridstack layout IDs match widget IDs: ' + (JSON.stringify(widgetIds) == JSON.stringify(gridstackIds) ? '✓' : 'X'));
      if (JSON.stringify(widgetIds) != JSON.stringify(gridstackIds)) {
        console.log('      Widget IDs: ' + JSON.stringify(widgetIds));
        console.log('      Gridstack IDs: ' + JSON.stringify(gridstackIds));
      }
    }
  } catch(err) {
    console.log('    Error: ' + err);
  }
}
