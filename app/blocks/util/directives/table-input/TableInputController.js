/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .controller('TableInputController', TableInputController);

    TableInputController.$inject = [
        '$mdDialog',
        'validations'
    ];
    /* @ngInject */
    function TableInputController($mdDialog, validations) {
        var vm = this;

        vm.dismiss = dismiss;
        vm.apply = apply;
        vm.validations = validations;

        activate();

        ////////////////

        function activate() {

        }

        function apply() {
            $mdDialog.hide(vm.model && vm.model.content || null);
        }

        function dismiss() {
            $mdDialog.cancel();
        }
    }

})(angular);
