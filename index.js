var fs = require('fs');

const packages = fs.readdirSync('../').filter(f => fs.statSync('../' + f).isDirectory() && f.startsWith('netuitive-packages-'));

packages.forEach(package => {
  console.log('------------------------------');
  console.log('Package: ' + package);

  var dashboards = fs.readdirSync('../' + package + '/dashboards/');
  dashboards.forEach(dashboard => {
    console.log('  Dashboard: ' + dashboard);

    try {
      var dsb = JSON.parse(fs.readFileSync('../' + package + '/dashboards/' + dashboard, 'utf8'));
      var contents = dsb.dashboard.properties.gridstackContents;
      console.log('    Has gridstack: ' + (contents ? '✓' : 'X'));

      var gridstack = JSON.parse(contents);
      console.log('    Gridstack content is valid JSON: ✓');

      var widgetIds = dsb.dashboard.widgets.map(w => w.id).sort();
      var layoutIds = [].concat.apply([], JSON.parse(dsb.dashboard.layout).contents.map(c => c.widgets)).sort();
      console.log('    Old layout IDs match widget IDs: ' + (JSON.stringify(widgetIds) == JSON.stringify(layoutIds) ? '✓' : 'X'));
      if (JSON.stringify(widgetIds) != JSON.stringify(layoutIds)) {
        console.log('      Widget IDs: ' + JSON.stringify(widgetIds));
        console.log('      Layout IDs: ' + JSON.stringify(layoutIds));
      }

      var gridstackIds = gridstack.map(g => g.id).sort();
      console.log('    Gridstack layout IDs match widget IDs: ' + (JSON.stringify(widgetIds) == JSON.stringify(gridstackIds) ? '✓' : 'X'));
      if (JSON.stringify(widgetIds) != JSON.stringify(layoutIds)) {
        console.log('      Widget IDs: ' + JSON.stringify(widgetIds));
        console.log('      Gridstack IDs: ' + JSON.stringify(gridstackIds));
      }
    } catch(err) {
      console.log('    Error: ' + err);
    }
  });
});
