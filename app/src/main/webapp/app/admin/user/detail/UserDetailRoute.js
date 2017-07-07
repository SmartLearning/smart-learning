/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .run(runUserDetail);

    runUserDetail.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runUserDetail(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'user.detail',
                config: {
                    url: '/{id}',
                    data: {
                        pageTitle: 'user.detail.title',
                        menu: {
                            indicatorState: 'user.list'
                        }
                    },
                    views: {
                        body: {
                            templateUrl: 'app/admin/user/detail/UserDetailView.html',
                            controller: 'UserDetailController',
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
