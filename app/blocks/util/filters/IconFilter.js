/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('icon', IconFilter);

    IconFilter.$inject = ['$filter'];
    /* @ngInject */
    function IconFilter($filter) {
        return icon;

        ///////////////////////////////////////////////////

        function icon(input, params) {
            var format = $filter('format');
            var output = '';
            var icon = '<md-icon>{0}</md-icon>';

            if (angular.isArray(input)) {
                angular.forEach(input, forEach);
            } else {
                output = format(icon, (params[input] ? params[input] : params['default']));
            }

            return output;

            ////////////////////////////////////////////////////////////////

            function forEach(item) {
                output += format(icon, (params[item] ? params[item] : params['default']));
            }
        }
    }

})(angular);
