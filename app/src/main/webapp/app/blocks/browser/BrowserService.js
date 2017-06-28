(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('Browser', BrowserService);

    BrowserService.$inject = ['deviceDetector'];
    /* @ngInject */
    function BrowserService(deviceDetector) {
        var supportedBrowsers = {
            chrome: '51.0.2704.84',
            firefox: '45.0.1',
            safari: '9.1.1'
        };
        this.isSupported = isSupported;
        this.browser = deviceDetector.browser;
        this.browser_version = deviceDetector.browser_version;

        function isSupported() {
            if (!supportedBrowsers[deviceDetector.browser]) {
                return false;
            }
            if (!deviceDetector.browser_version) {
                return false;
            }
            return compareVersion(deviceDetector.browser_version, supportedBrowsers[deviceDetector.browser]) !== -1;
        }

        function compareVersion(version, otherVersion) {
            if (version === otherVersion) {
                return 0;
            }

            var versionComponents = version.split(".");
            var otherVersionComponents = otherVersion.split(".");

            var len = Math.min(versionComponents.length, otherVersionComponents.length);

            // loop while the components are equal
            for (var i = 0; i < len; i++) {
                if (parseInt(versionComponents[i]) > parseInt(otherVersionComponents[i])) {
                    return 1;
                }

                if (parseInt(versionComponents[i]) < parseInt(otherVersionComponents[i])) {
                    return -1;
                }
            }

            // If one's a prefix of the other, the longer one is greater.
            if (versionComponents.length > otherVersionComponents.length) {
                return 1;
            }

            if (versionComponents.length < otherVersionComponents.length) {
                return -1;
            }

            // Otherwise they are the same.
            return 0;
        }
    }
})(angular);
