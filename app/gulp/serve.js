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
    var baseUri = config.uri + config.apiPort;
    // Routes to proxy to the backend. Routes ending with a / will setup
    // a redirect so that if accessed without a trailing slash, will
    // redirect. This is required for some endpoints for proxy-middleware
    // to correctly handle them.
    var proxyRoutes = ['/'];

    var requireTrailingSlash = proxyRoutes.filter(onFilterProxy).map(stripTrailingSlash);

    // Ensure trailing slash in routes that require it
    // Build a list of proxies for routes: [route1_proxy, route2_proxy, ...]
    var proxies = [trailingSlash].concat(proxyRoutes.map(iterateOnRoute));

    browserSync({
        open: true,
        port: config.port,
        server: {
            baseDir: config.app,
            middleware: proxies
        }
    });

    gulp.start('watch');

    ///////////////////////////////

    function onFilterProxy(r) {
        return util.endsWith(r, '/');
    }

    function stripTrailingSlash(r) {
        // Strip trailing slash so we can use the route to match requests
        // with non trailing slash
        return r.substr(0, r.length - 1);
    }

    function trailingSlash(req, res, next) {
        requireTrailingSlash.forEach(iterate);

        next();

        //////////////////////////////////////

        function iterate(route) {
            if (url.parse(req.url).path === route) {
                res.statusCode = 301;
                res.setHeader('Location', route + '/');
                res.end();
            }
        }
    }

    function iterateOnRoute(r) {
        var options = url.parse(baseUri + r);
        options.route = r;
        options.preserveHost = true;
        return proxy(options);
    }
}
