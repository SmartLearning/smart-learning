/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.gateway')
        .run(runGateway);

    runGateway.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runGateway(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'gateway',
                config: {
                    url: '/gateway',
                    parent: 'admin',
                    data: {
                        pageTitle: 'gateway.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/gateway/GatewayView.html',
                            controller: 'GatewayController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language
                    },
                    menu: {
                        icon: 'fa fa-road fa-md-size',
                        text: 'global.menu.admin.gateway',
                        order: 4
                    }
                }
            }
        ];
    }

    language.$inject = [
        '$translate',
        '$translatePartialLoader'
    ];
    /* @ngInject */
    function language($translate, $translatePartialLoader) {
        $translatePartialLoader.addPart('gateway');
        return $translate.refresh();
    }
})(angular);
