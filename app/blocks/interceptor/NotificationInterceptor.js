/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('notificationInterceptor', notificationInterceptorFactory);

    notificationInterceptorFactory.$inject = ['Alert'];
    /* @ngInject */
    function notificationInterceptorFactory(Alert) {
        return {
            response: response
        };

        ///////////////////////////////////////////////////////

        function response(response) {
            if (!angular.isObject(response.config) || response.config.broadcast !== false) {
                var alertKey = response.headers('X-smartApp-alert');
                if (angular.isString(alertKey)) {
                    Alert.success(
                        alertKey,
                        {
                            param: response.headers('X-smartApp-params')
                        }
                    );
                }
            }
            return response;
        }
    }

})(angular);
