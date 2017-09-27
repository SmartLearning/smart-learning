'use strict';

var gulp = require('gulp');
var util = require('./utils');
var url = require('url');
var browserSync = require('browser-sync');
var proxy = require('proxy-middleware');

var config = require('./config');

module.exports = serve;

///////////////////////////

function serve() {
    browserSync({
        open: true,
        port: config.port,
        server: {
            baseDir: config.app
        }
    });
}
