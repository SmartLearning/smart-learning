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
        '$sce',
        '$http'
    ];

    /* @ngInject */
    function AppController($mdDialog, $mdUtil, $mdSidenav, $timeout, $sce, $http) {
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

        let apiKey = 'AIzaSyAPv2lxveRF_vRWo8vLY4juoq40CvNDsTM';
        let rootFolderId = '0B7TUAIgyr7KDaUw1X0c3dDlVeEU';
        const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
        const SPREADSHEET_MIME_TYPE = "application/vnd.google-apps.spreadsheet";

        vm.listCourses = function () {
            listItems(rootFolderId,FOLDER_MIME_TYPE).then(t =>{
                console.log('data in the final block');

                console.log(t.files);
            })


        };




        function listItems(rootId, mimeType) {
            let q = `'${rootId}' in parents`;
            if (mimeType !== undefined) {
                q += ` and mimeType = '${mimeType}'`
            }
            return $http({
                method: 'GET',
                url: `https://www.googleapis.com/drive/v3/files?q=${q}&key=${apiKey}`
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log('success in getting courses');

                return response.data;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('error in getting courses')
            });

        }


    }

})(angular);
