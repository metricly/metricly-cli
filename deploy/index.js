var zipFolder = new require('zip-folder');

module.exports = function(location) {
  console.log('\nDeploying package');
  return createZip(location).then((zip) => {
    console.log('\nDone deploying');
  });
};

function createZip(location) {
  var zip = './package.zip';
  return new Promise((resolve, reject) => {
    zipFolder(location, zip, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(zip);
      }
    });
  });
}
