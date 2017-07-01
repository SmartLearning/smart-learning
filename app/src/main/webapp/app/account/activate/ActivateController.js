/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.activate')
        .controller('ActivateController', ActivateController);

    ActivateController.$inject = [
        '$stateParams',
        'Activate'
    ];

    function ActivateController($stateParams, Activate) {
        var vm = this;

        Activate.get({key: $stateParams.key}, onSuccess, onCatch);

        ///////////////////////////////////////////

        function onCatch() {
            vm.success = null;
            vm.error = 'ERROR';
        }

        function onSuccess() {
            vm.error = null;
            vm.success = 'OK';
        }
    }
})(angular);
