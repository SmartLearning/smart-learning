/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$mdDialog'];

    /* @ngInject */
    function AppController($mdDialog) {
        var vm = this;

        vm.pages = [
            {name: 'My Messages'},
            {name: 'Unread Messages'}
        ];

        vm.showTableOfContent = showTableOfContent;

        activate();

        ////////////////

        function activate() {

        }

        function showTableOfContent(ev) {
            $mdDialog.show({
                templateUrl: 'views/DialogView',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }
    }

})(angular);
