/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('reset.request')
        .controller('ResetRequestController', ResetRequestController);

    ResetRequestController.$inject = [
        'Reset',
        'Alert'
    ];
    /* @ngInject */
    function ResetRequestController(Reset, Alert) {
        var vm = this;

        vm.requestReset = requestReset;
        vm.model = {};
        vm.emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

        activate();

        /////////////////////////

        function activate() {
        }

        function requestReset() {
            Alert.clear();

            Reset.resetPasswordRequest(vm.model.email).then(onResetFinishSuccess);

            //////////////////////////

            function onResetFinishSuccess() {
                Alert.success('reset.request.messages.success');
            }
        }
    }

})(angular);
