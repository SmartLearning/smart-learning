/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.register')
        .controller('SignUpController', SignUpController);

    SignUpController.$inject = [];
    /* @ngInject */
    function SignUpController() {
        var vm = this;

        vm.model = {};
        vm.websitePattern = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
        vm.usernamePattern = /^[a-zA-Z0-9.-]+$/;
        vm.trimPattern = /^[^\s].*[^\s]$/;
        vm.passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%*()_+^&])[a-zA-Z0-9!@#$%*()_+^&]*$/;
        vm.emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/;
        vm.urlPostFixPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
        vm.phoneNumberPattern = /^0 \([1-9][\d]{2}\) [\d]{3}-[\d]{4}$/;

        activate();

        ////////////////

        function activate() {
        }

        function signUp(form) {

        }
    }

})(angular);
