/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.register')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = [
        'Language',
        'Account',
        'Alert'
    ];
    /* @ngInject */
    function RegisterController(Language, Account, Alert) {
        var vm = this;

        vm.model = {};
        vm.usernamePattern = /^[a-zA-Z0-9.-]+$/;
        vm.emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/;

        vm.register = register;

        activate();

        ////////////////////////////////////////////

        function activate() {
        }

        function register(event) {
            event.preventDefault();
            Language.getCurrent().then(onLanguage);

            ////////////////////////////////////////////////

            function onLanguage(lang) {
                vm.model.langKey = lang;

                Account.register({}, vm.model, onSuccess);

                //////////////////////////////////////////////////

                function onSuccess() {
                    Alert.info('account.info.register')
                }
            }
        }
    }

})(angular);
