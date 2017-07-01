/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('HtmlTagUtil', HtmlTagUtilService);

    HtmlTagUtilService.$inject = [];
    /* @ngInject */
    function HtmlTagUtilService() {
        this.escapeTags = escapeTags;

        ////////////////

        function escapeTags(stringWithTags) {
            return stringWithTags
                .replace(/<\/?(b|i|em|strong|span|u|strikethrough|a|img|small|sub|sup|label)( [^>*?])?>/gi, '') // remove inline tags without adding spaces
                .replace(/(<[^>]*?>\s*<[^>]*?>)/ig, ' ') // replace adjacent tags with possible space between with a space
                .replace(/(<[^>]*?>)/ig, '') // remove any singular tags
                .replace(/\s+/ig, ' ');// condense spacing
        }
    }

})(angular);
