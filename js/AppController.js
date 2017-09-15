/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = [
        '$mdDialog',
        '$mdUtil',
        '$mdSidenav',
        '$timeout',
        '$sce'
    ];

    /* @ngInject */
    function AppController($mdDialog, $mdUtil, $mdSidenav, $timeout, $sce) {
        var vm = this;

        vm.pages = [
            {
                type: 'exam',
                title: 'My Messages',
                url: $sce.trustAsResourceUrl('https://docs.google.com/document/d/1Z4bk8xSx-8AudSwHAdUT2KgBQsPi7PmiOzBwzPKVSt8/pub?embedded=true')
            },
            {
                type: 'exam',
                title: 'Possessives',
                url: $sce.trustAsResourceUrl('https://drive.google.com/open?id=1KZCIs_nVrB7NWP1F0N53UIH7VSUAJDNrUX58BiIx6uQ')
            }
        ];

        vm.showTableOfContent = showTableOfContent;
        vm.changePage = changePage;
        vm.openMenu = openMenu;

        activate();

        ////////////////

        function activate() {
            changePage(vm.pages[0]);
        }

        function openMenu() {
            console.log(2);
            $mdUtil.debounce(timer, 200)();

            ///////////////////////////////////////////

            function timer() {
                $mdSidenav('left').toggle();
            }
        }

        function showTableOfContent(ev) {
            $mdDialog.show({
                templateUrl: 'views/DialogView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }

        function changePage(item) {
            var iframe = angular.element(document.querySelector('#content'));
            iframe.attr('src', '');
            vm.current = item;

            $timeout(changeUrl, 100);

            ////////////////////////////////////////////

            function changeUrl() {
                iframe.attr('src', item.url);

                $mdSidenav('left').close();
            }
        }
    }

})(angular);
