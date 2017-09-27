/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

'use strict';

var del = require('del');

var config = require('./config');

module.exports = {
    all: all,
    css: css
};

//////////////////////////

function all() {
    return del(config.dist, {dot: true});
}

function css() {
    return del(config.css, {dot: true});
}
