/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .run(runUserDelete);

    runUserDelete.$inject = ['routerHelper'];
    /* @ngInject */
    function runUserDelete(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'user.delete',
                config: {
                    url: '/{id}/delete',
                    data: {
                        pageTitle: 'user.delete.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/user/delete/UserDeleteView.html',
                            controller: 'UserDeleteController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        entity: entity
                    }
                }
            }
        ];
    }

    entity.$inject = [
        '$stateParams',
        'User'
    ];
    /* @ngInject */
    function entity($stateParams, User) {
        if ($stateParams.id) {
            return User.get({id: $stateParams.id}).$promise;
        }

        return null;
    }
})(angular);
