/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$mdDialog','$sce'];

    /* @ngInject */
    function AppController($mdDialog,$sce) {
        var vm = this;

        vm.pages = [
            {name: 'My Messages', url: $sce.trustAsResourceUrl('https://docs.google.com/document/d/1Z4bk8xSx-8AudSwHAdUT2KgBQsPi7PmiOzBwzPKVSt8/pub?embedded=true')},
            {name: 'Unread Messages', url: $sce.trustAsResourceUrl('http://www.varzesh3.com')}
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
            vm.current = item;
        }
    }

})(angular);
