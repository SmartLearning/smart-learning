/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .run(runUserList);

    runUserList.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runUserList(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'user.list',
                config: {
                    url: '',
                    data: {
                        pageTitle: 'user.list.title'
                    },
                    views: {
                        body: {
                            templateUrl: 'app/admin/user/list/UserListView.html',
                            controller: 'UserListController',
                            controllerAs: 'vm'
                        }
                    },
                    menu: {
                        parent: 'admin',
                        icon: 'person',
                        text: 'global.menu.admin.users',
                        order: 7
                    }
                }
            }
        ];
    }
})(angular);
