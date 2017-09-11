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
        vm.changePage = changePage;

        activate();

        ////////////////

        function activate() {
            changePage(vm.pages[0]);
        }

        function showTableOfContent(ev) {
            $mdDialog.show({
                templateUrl: 'views/DialogView',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }

        function changePage(item) {
            vm.title = item.name;
        }
    }

})(angular);
