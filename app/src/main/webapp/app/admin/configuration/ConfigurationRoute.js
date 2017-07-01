/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.configuration')
        .run(runConfiguration);

    runConfiguration.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runConfiguration(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'configuration',
                config: {
                    url: '/configuration',
                    parent: 'admin',
                    data: {
                        pageTitle: 'configuration.title',
                        menu: {
                            icon: 'equalizer',
                            text: 'global.menu.admin.configuration',
                            order: 2
                        }
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/configuration/ConfigurationView.html',
                            controller: 'ConfigurationController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language
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
        $translatePartialLoader.addPart('configuration');
        return $translate.refresh();
    }
})(angular);
