/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.password')
        .controller('PasswordController', PasswordController);

    PasswordController.$inject = [
        'Alert',
        'Account'
    ];
    /* @ngInject */
    function PasswordController(Alert, Account) {
        var vm = this;

        vm.changePassword = changePassword;

        ///////////////////////

        function changePassword() {
            if (vm.model.password !== vm.model.confirmPassword) {
                Alert.error('password.errors.not_match');
            } else {
                Account.changePassword({}, vm.model.password, onSuccess, onError);
            }

            ////////////////////////

            function onSuccess() {
                Alert.success('password.messages.success');
            }

            function onError() {
                Alert.error('password.errors.unknown');
            }
        }
    }

})(angular);
