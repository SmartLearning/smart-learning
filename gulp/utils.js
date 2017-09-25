'use strict';

var fs = require('fs');

module.exports = {
    endsWith : endsWith,
    parseVersion : parseVersion,
    isLintFixed : isLintFixed
};

/////////////////////////

function endsWith(str, suffix) {
    return str.indexOf('/', str.length - suffix.length) !== -1;
}

// Returns the second occurrence of the version number from `build.gradle` file
function parseVersion() {
    var buildGradle = fs.readFileSync('version.json', 'utf8');
    var parse = JSON.parse(buildGradle);
    return parse.sub;
}

function isLintFixed(file) {
    // Has ESLint fixed the file contents?
    return file.eslint !== null && file.eslint.fixed;
}
