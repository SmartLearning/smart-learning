/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.reset')
        .factory('Reset', ResetFactory);

    ResetFactory.$inject = [
        'ResetFinish',
        'ResetRequest'
    ];
    /* @ngInject */
    function ResetFactory(ResetFinish, ResetRequest) {
        return {
            resetPasswordFinish: resetPasswordFinish,
            resetPasswordRequest: resetPasswordRequest
        };

        ////////////////

        function resetPasswordFinish(keyAndPassword, callback) {
            var cb = callback || angular.noop;

            return ResetFinish.save(
                keyAndPassword,
                onResetFinishSuccess,
                onResetFinishError
            ).$promise;

            /////////////////////

            function onResetFinishSuccess() {
                return cb();
            }

            function onResetFinishError(err) {
                return cb(err);
            }
        }

        function resetPasswordRequest(mail, callback) {
            var cb = callback || angular.noop;

            return ResetRequest.save(
                mail,
                onResetRequestSuccess,
                onResetRequestError
            ).$promise;

            /////////////////////

            function onResetRequestSuccess() {
                return cb();
            }

            function onResetRequestError(err) {
                return cb(err);
            }
        }
    }

})(angular);

