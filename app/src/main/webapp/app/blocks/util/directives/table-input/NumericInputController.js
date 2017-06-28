/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .controller('NumericInputController', NumericInputController);

    NumericInputController.$inject = [
        '$mdDialog',
        'validations'
    ];
    /* @ngInject */
    function NumericInputController($mdDialog, validations) {
        var vm = this;

        vm.dismiss = dismiss;
        vm.apply = apply;
        vm.validations = validations;
        vm.patternOnlyOneDecimal = /^[0-9]+(\.[0-9]{1,2})?$/;

        activate();

        ////////////////

        function activate() {

        }

        function apply() {
            $mdDialog.hide(vm.model && parseFloat(vm.model.content) || null);
        }

        function dismiss() {
            $mdDialog.cancel();
        }
    }

})(angular);
