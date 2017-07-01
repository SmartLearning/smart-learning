/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.layout')
        .constant(
            'MenuIcons', {
                ROOT: 'apps',
                ADMIN: 'perm_data_setting',
                ACCOUNT: 'vpn_key'
            }
        );

})(angular);
