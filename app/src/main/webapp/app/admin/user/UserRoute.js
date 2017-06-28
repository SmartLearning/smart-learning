/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .run(runUser);

    runUser.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runUser(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'user',
                config: {
                    url: '/users',
                    abstract: true,
                    parent: 'admin',
                    data: {
                        pageTitle: 'user.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/user/UserView.html',
                            controller: 'UserController',
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
        $translatePartialLoader.addPart('user');
        return $translate.refresh();
    }
})(angular);
