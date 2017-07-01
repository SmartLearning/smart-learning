/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('reset.finish')
        .controller('ResetFinishController', ResetFinishController);

    ResetFinishController.$inject = [
        '$stateParams',
        'Reset',
        'Alert'
    ];
    /* @ngInject */
    function ResetFinishController($stateParams, Reset, Alert) {
        var vm = this;

        vm.finishReset = finishReset;
        vm.keyNotExist = angular.isUndefined($stateParams.key);
        vm.model = {};

        activate();

        /////////////////////////

        function activate() {
            Alert.clear();
            if (vm.keyNotExist) {
                Alert.error('reset.finish.errors.key_missing', null, 0);
            }
        }

        function finishReset() {
            if (vm.model.password !== vm.model.confirmPassword) {
                Alert.error('reset.finish.errors.do_not_match');
            } else {
                Reset.resetPasswordFinish({
                    key: $stateParams.key,
                    newPassword: vm.model.password
                }).then(onResetFinishSuccess);
            }

            //////////////////////////

            function onResetFinishSuccess() {
                Alert.success('reset.finish.messages.success');
            }
        }
    }

})(angular);

