/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('buttons', ButtonsFilter);

    ButtonsFilter.$inject = ['$filter'];
    /* @ngInject */
    function ButtonsFilter($filter) {
        return buttons;

        ////////////////

        function buttons(input, params) {
            var format = $filter('format');
            var output = '';
            var container = '<div flex layout-align="start center" layout="row">{0}</div>';
            var button = '<md-button ng-attr-ng-click="{0}" class="no-margin {1}"><span translate>{2}</span></md-button>';

            angular.forEach(
                params, function (item) {
                    var cls = (item.value === input) ? item.activeCls : '';// check if it's selected or not
                    cls += ' ' + (item.class ? item.class : '');
                    output += format(button, item.click ? item.click.replace(/"/g, '\'') : '', cls.replace(/"/g, '\''), item.text);
                }
            );

            return format(container, output);
        }
    }

})(angular);
