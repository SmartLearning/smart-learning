/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('UrlUtil', UrlUtilService);

    UrlUtilService.$inject = [];
    /* @ngInject */
    function UrlUtilService() {
        this.isUrl = isUrl;
        this.isImageUri = isImageUri;
        this.isFileCloudUrl = isFileCloudUrl;
        this.isShortFileCloudUrl = isShortFileCloudUrl;
        this.isLocalStorageUrl = isLocalStorageUrl;

        ////////////////

        function isUrl(url) {
            var regexp = /^(ftp|http|https):\/\/(\w+:?\w*@)?(\w+\.*\w*)?(:[0-9]+)?([^<>"';]+)$/i;
            return regexp.test(url);
        }

        function isImageUri(uri) {
            var regexp = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i;
            return regexp.test(uri);
        }

        function isFileCloudUrl(uri) {
            var regexp = /^\/file-cloud\/[^<>"']+.(jpg|jpeg|gif|png)$/i;
            return regexp.test(uri);
        }

        function isShortFileCloudUrl(uri) {
            var regexp = /^[^<>"']+.(jpg|jpeg|gif|png)$/i;
            return regexp.test(uri);
        }

        function isLocalStorageUrl(uri) {
            var regexp = /^\/content\/images\/[^<>"']+.(jpg|jpeg|gif|png)$/i;
            return regexp.test(uri);
        }
    }

})(angular);
