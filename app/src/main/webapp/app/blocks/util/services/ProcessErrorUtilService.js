/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('ProcessErrorUtil', ProcessErrorUtilService);

    ProcessErrorUtilService.$inject = ['$mdDialog'];
    /* @ngInject */
    function ProcessErrorUtilService($mdDialog) {
        this.showErrors = showErrors;

        ////////////////

        function showErrors(processId) {
            $mdDialog.show(
                {
                    controller: 'ProcessErrorUtilController',
                    controllerAs: 'vm',
                    templateUrl: 'app/blocks/util/services/ProcessErrorUtilView.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    locals: {
                        processId: processId
                    },
                    resolve: {
                        language: language
                    }
                }
            );

            language.$inject = [
                '$translate',
                '$translatePartialLoader'
            ];
            /* @ngInject */
            function language($translate, $translatePartialLoader) {
                $translatePartialLoader.addPart('process');
                return $translate.refresh();
            }
        }

    }

})(angular);
