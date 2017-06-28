/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    var constant = {
        roles: getRoles(),
        getAllRoles: function (justAdmin, exclude) {
            var roles = getRoles();
            return Object.keys(roles).map(fetch).filter(onFilter);

            //////////////////////////////////////////

            function fetch(obj) {
                return roles[obj];
            }

            function onFilter(item) {
                var ex = (exclude ? [exclude] : null) || [];
                if (ex.indexOf(item) > -1) {
                    return false;
                }
                return !justAdmin || item.indexOf('ADMIN') > -1;
            }

        }
    };

    angular
        .module('account.util')
        .constant('AccountConstants', constant);

    function getRoles() {
        return {
            ADMIN: 'ROLE_ADMIN',
            USER: 'ROLE_USER'
        };
    }
})(angular);
