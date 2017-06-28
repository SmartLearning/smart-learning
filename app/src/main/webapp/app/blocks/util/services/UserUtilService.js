/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('UserUtil', UserUtilService);

    UserUtilService.$inject = [
        'PopulationUtil',
        'User'
    ];
    /* @ngInject */
    function UserUtilService(PopulationUtil, User) {
        this.populateUsernameById = populateUsernameById;

        //////////////////////////////////////////////////////

        function populateUsernameById(deferred, userProperty, convertedProperty) {
            return PopulationUtil.populateBy(
                deferred,
                User.getByIds,
                userProperty,
                'id',
                'login',
                convertedProperty
            );
        }
    }

})(angular);
