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
        'ResetRequest',
        'Language',
        'AccountConstants',
        'Alert',
        'Principal'
    ];
    /* @ngInject */
    function UserDetailController($state, entity, User, ResetRequest, Language, AccountConstants, Alert, Principal) {
        var vm = this;

        vm.save = saveModel;
        vm.delete = deleteModel;
        vm.setActive = setActive;
        vm.resetPassword = resetPassword;
        vm.emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
        vm.authorities = [];
        vm.languages = null;
        vm.model = entity;

        activate();

        ////////////////

        function activate() {
            Language.getAll().then(onLanguageSuccess);
            Principal.identity().then(onIdentifySuccess);

            //////////////////////////////

            function onLanguageSuccess(languages) {
                vm.languages = languages;
            }

            function onIdentifySuccess(user) {
                vm.authorities = AccountConstants.getAvailableRoles(user.authorities || []);
            }
        }

        function setActive(event, user, isActivated) {
            event.preventDefault();
            event.stopPropagation();

            user.activated = isActivated;
            User.update(user, onUserUpdate);

            //////////////////////

            function onUserUpdate() {
                vm.loadAll();
                vm.clear();
            }
        }

        function saveModel() {
            vm.isSaving = true;
            if (vm.model.id) {
                User.update(vm.model, onSaveSuccess, onSaveError);
            } else {
                User.save(vm.model, onSaveSuccess, onSaveError);
            }

            //////////////////////

            function onSaveSuccess(user) {
                vm.isSaving = false;
                $state.go('user.detail', {id: user.id}, {reload: true});
            }

            function onSaveError() {
                vm.isSaving = false;
            }
        }

        function deleteModel(event) {
            if (!vm.model.id) {
                return;
            }

            Alert.confirm(
                event,
                'user.delete.title',
                'user.delete.message',
                'user.delete.delete',
                'user.delete.cancel', {
                    login: vm.model.login
                }
            ).then(
                function (yes) {
                    if (yes) {
                        User.delete({id: vm.model.id}, onDeleteSuccess);
                    }

                    //////////////////////

                    function onDeleteSuccess() {
                        $state.go('user.list');
                    }
                }
            );
        }

        function resetPassword() {
            Alert.confirm(
                event,
                'user.reset_password.title',
                'user.reset_password.message',
                'user.reset_password.reset',
                'user.reset_password.cancel', {
                    login: vm.model.login
                }
            ).then(
                function (yes) {
                    if (yes) {
                        ResetRequest.save({}, vm.model.email, onResetSuccess);
                    }

                    //////////////////////

                    function onResetSuccess() {
                        $state.go('user.detail', {id: vm.model.id}, {reload: true});
                    }
                }
            );
        }
    }

})(angular);
