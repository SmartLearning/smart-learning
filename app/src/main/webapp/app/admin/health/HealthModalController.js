/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.health')
        .controller('HealthModalController', HealthModalController);

    HealthModalController.$inject = [
        '$uibModalInstance',
        'currentHealth',
        'baseName',
        'subSystemName'
    ];
    /* @ngInject */
    function HealthModalController($uibModalInstance, currentHealth,
                                   baseName, subSystemName) {
        var vm = this;

        vm.cancel = cancel;
        vm.currentHealth = currentHealth;
        vm.baseName = baseName;
        vm.subSystemName = subSystemName;

        activate();

        ////////////////

        function activate() {

        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        var a = {
            "fields": {
                "description": {
                    "type": "string",
                    "validations": [
                        {
                            "name": ""
                        }
                    ]
                }
            }
        }

    }

})(angular);
