/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module(
            'app.account', [
                'account.util',
                'account.login',
                'account.logout',
                'account.register'
            ]
        );

})(angular);
