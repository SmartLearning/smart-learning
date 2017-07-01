/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$state',
        'Auth'
    ];
    /* @ngInject */
    function LoginController($state, Auth) {
        var vm = this;
        vm.model = {};
        vm.login = login;

        activate();

        ////////////////

        function activate() {

        }

        function login(event) {
            event.preventDefault();
            vm.model.rememberMe = true;
            Auth.login(vm.model).then(onSuccess);

            //////////////////////////////////////////

            function onSuccess() {
                $state.go('home', {}, {reload: true});
            }
        }
    }

})(angular);
