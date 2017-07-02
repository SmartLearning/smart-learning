/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('reset.finish')
        .factory('ResetFinish', ResetFinishFactory);

    ResetFinishFactory.$inject = [
        '$resource',
        'DateUtils'
    ];
    /* @ngInject */
    function ResetFinishFactory($resource, DateUtils) {
        return $resource('api/account/reset_password/finish', {}, {
            save: {
                method: 'POST',
                transformRequest: DateUtils.toServer,
                transformResponse: DateUtils.fromServer
            }
        });
    }

})(angular);

