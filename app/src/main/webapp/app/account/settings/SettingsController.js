/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.settings')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = [
        '$state',
        '$translate',
        'Principal',
        'Auth',
        'Language'
    ];
    /* @ngInject */
    function SettingsController($state, $translate, Principal, Auth, Language) {
        var vm = this;

        vm.save = save;
        vm.model = null;
        vm.languages = null;

        activate();

        ////////////////

        function activate() {
            copyAccount();
            Language.getAll().then(onSuccess);

            /////////////////////////////////////////////////////

            function onSuccess(data) {
                vm.languages = data;
            }
        }

        function save() {
            Auth.updateAccount(vm.model)
                .then(onSaveSuccess)
                .catch(onError);
        }

        function onSaveSuccess() {
            copyAccount();
            Language.getCurrent().then(onSuccess);

            /////////////////////////////////////////////////////////

            function onSuccess(current) {
                if (vm.model.langKey !== current) {
                    $translate.use(vm.model.langKey);
                }
                $state.go('settings', {}, {reload: true});
            }


        }

        function copyAccount() {
            Principal.identity().then(onAccount);

            ///////////////////////////////////////////////

            function onAccount(account) {
                vm.model = account || {};
            }
        }

        function onError() {
            vm.success = null;
            vm.error = 'ERROR';
        }

    }

})(angular);
