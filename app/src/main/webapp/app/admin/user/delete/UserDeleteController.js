/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .controller('UserDeleteController', UserDeleteController);

    UserDeleteController.$inject = [
        '$uibModal',
        'entity',
        'User'
    ];
    /* @ngInject */
    function UserDeleteController($uibModal, entity, User) {
        var vm = this;

        vm.user = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        activate();

        ////////////////

        function activate() {

        }

        function clear() {
            $uibModal.dismiss('cancel');
        }

        function confirmDelete(id) {
            User.delete(
                {id: id},
                function () {
                    $uibModal.close(true);
                }
            );
        }
    }

})(angular);
