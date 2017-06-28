/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .controller('UserDetailController', UserDetailController);

    UserDetailController.$inject = [
        '$state',
        'entity',
        'User',
        'Language',
        'AccountConstants'
    ];
    /* @ngInject */
    function UserDetailController($state, entity, User, Language, AccountConstants) {
        var vm = this;

        vm.authorities = AccountConstants.roles;
        vm.languages = null;
        vm.save = save;
        vm.model = entity;

        activate();

        ////////////////

        function activate() {
            Language.getAll().then(
                function (languages) {
                    vm.languages = languages;
                }
            );
        }

        function onSaveSuccess() {
            vm.isSaving = false;
            $state.transitionTo('user', {}, {reload: true});
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        function save() {
            vm.isSaving = true;
            if (vm.model.id) {
                User.update(vm.model, onSaveSuccess, onSaveError);
            } else {
                User.save(vm.model, onSaveSuccess, onSaveError);
            }
        }
    }

})(angular);
