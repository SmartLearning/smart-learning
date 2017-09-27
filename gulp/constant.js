/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

'use strict';

var gulp = require('gulp');
var constant = require('gulp-ng-constant');
var rename = require('gulp-rename');

var config = require('./config');
var util = require('./utils');

module.exports = {
    dev: dev,
    prod: prod
};

//////////////////////////////

function dev() {
    return constant(
        {
            name: 'app.blocks',
            template: config.constantTemplate,
            stream: true,
            constants: {
                VERSION: util.parseVersion(),
                DEBUG_INFO_ENABLED: true
            }
        }
    )
        .pipe(rename('BlocksConstants.js'))
        .pipe(gulp.dest(config.app + 'app/blocks/'));
}

function prod() {
    return constant(
        {
            name: 'app.blocks',
            template: config.constantTemplate,
            stream: true,
            constants: {
                VERSION: util.parseVersion(),
                DEBUG_INFO_ENABLED: false
            }
        }
    )
        .pipe(rename('BlocksConstants.js'))
        .pipe(gulp.dest(config.app + 'app/blocks/'));
}
