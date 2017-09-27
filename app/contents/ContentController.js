/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.content')
        .controller('ContentController', ContentController);

    ContentController.$inject = [
        '$timeout',
        '$sce',
        'id'
    ];

    /* @ngInject */
    function ContentController($timeout, $sce, id) {
        var vm = this;

        activate();

        ////////////////////////////////////////

        function activate() {
            changePage('https://docs.google.com/document/d/' + id + '/pub?embedded=true')
        }

        function changePage(url) {
            url = $sce.trustAsResourceUrl(url);
            var iframe = angular.element(document.querySelector('#content'));
            iframe.attr('src', '');

            $timeout(changeUrl, 100);

            ////////////////////////////////////////////

            function changeUrl() {
                iframe.attr('src', url);
            }
        }
    }

})(angular);
