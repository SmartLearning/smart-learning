/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('smartApp')
        .controller('AppController', AppController);

    AppController.$inject = [
        '$mdDialog',
        '$mdUtil',
        '$mdSidenav',
        '$timeout',
        '$sce',
        '$state'
    ];

    /* @ngInject */
    function AppController($mdDialog, $mdUtil, $mdSidenav, $timeout, $sce, $state) {

        const SPREADSHEET_MIME_TYPE = "application/vnd.google-apps.spreadsheet";
        const DOCUMENT_MIME_TYPE = "application/vnd.google-apps.document";

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
        vm.listQuestions = listQuestions;
        vm.goTo = goTo;
        vm.changePage = changePage;
        vm.openMenu = openMenu;

        activate();

        ////////////////////////////////

        function activate() {
            changePage(vm.pages[0]);
        }

        function goTo(state) {
            $state.go(state, null, {reload: true});
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

        function listQuestions() {
            getQuestions('1FqmeBTcnVTOTNeXegnXTuczrLTbqtGXh0kO5bXRej2M').then(onThen);

            ///////////////////////////////////////////////////

            function onThen(t) {
                console.log(t);
            }
        }
    }
})(angular);
