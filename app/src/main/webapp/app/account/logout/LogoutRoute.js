/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular.module('account.logout')
        .run(runLogout);

    runLogout.$inject = ['routerHelper'];
    /* @ngInject */
    function runLogout(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'logout',
                config: {
                    url: '/logout',
                    parent: 'account',
                    resolve: {
                        logout: logout
                    }
                }
            }
        ];
    }

    logout.$inject = [
        '$window',
        'Auth'
    ];
    /* @ngInject */
    function logout($window, Auth) {
        Auth.logout();
        $window.location.replace('/');
    }
})(angular);
