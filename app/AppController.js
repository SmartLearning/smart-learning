/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('smartApp')
        .controller('AppController', AppController);

    AppController.$inject = [
        '$mdUtil',
        '$mdSidenav',
        '$state'
    ];

    /* @ngInject */
    function AppController($mdUtil, $mdSidenav, $state) {

        var vm = this;

        vm.pages = [
            {
                type: 'exam',
                title: 'My Messages',
                id: '1Z4bk8xSx-8AudSwHAdUT2KgBQsPi7PmiOzBwzPKVSt8'
            },
            {
                type: 'exam',
                title: 'Possessives',
                id: '1KZCIs_nVrB7NWP1F0N53UIH7VSUAJDNrUX58BiIx6uQ'
            }
        ];

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
            $mdUtil.debounce(timer, 200)();

            ///////////////////////////////////////////

            function timer() {
                $mdSidenav('left').toggle();
            }
        }

        function changePage(item) {
            vm.current = item;
            $state.go('content', {id: item.id}, {reload: true});
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
