/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('reset.request')
        .factory('ResetRequest', ResetRequestFactory);

    ResetRequestFactory.$inject = [
        '$resource',
        'DateUtils'
    ];
    /* @ngInject */
    function ResetRequestFactory($resource, DateUtils) {
        return $resource('api/account/reset_password/init', {}, {
            save: {
                method: 'POST',
                transformRequest: DateUtils.toServer,
                transformResponse: DateUtils.fromServer
            }
        });
    }

})(angular);

