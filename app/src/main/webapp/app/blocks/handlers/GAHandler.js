(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('GAHandler', GAHandler);

    GAHandler.$inject = [
        '$rootScope',
        '$window',
        '$location'
    ];
    /* @ngInject */
    function GAHandler($rootScope, $window, $location) {
        this.sendPageEvent = sendPageEvent;

        ////////////////

        function sendPageEvent() {
            $rootScope.$on('$stateChangeSuccess', function (event) {
                var page = $location.path();
                if (page === "/") {
                    page = "mainpage";//GA.js can not handle /
                }
                $window.ga && $window.ga('send', 'pageview', page);
            });
        }

    }

})(angular);
