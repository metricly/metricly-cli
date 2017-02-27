# Package Validator
Small script for parsing and validating packages.

## Use
**Package Validator** requires all the Netuitive packages to be cloned in the same directory so **Package Validator** can crawl that directory. **Package Validator** filters for folders which start with **netuitive-packages-** so it's fine with clone this project in the same folder as all the packages.

To run the report run `node index.js <package-directory>`.

## Single Use
To run inside a single package repository use the following line:
```
npm i git+https://git@github.com/Netuitive/netuitive-package-validator.git && node -e "require('package-validator').validate('.', require('./package.json').id)"
```
