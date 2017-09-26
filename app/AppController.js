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
        '$http'
    ];

    /* @ngInject */
    function AppController($mdDialog, $mdUtil, $mdSidenav, $timeout, $sce, $http) {

        const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
        const SPREADSHEET_MIME_TYPE = "application/vnd.google-apps.spreadsheet";
        const DOCUMENT_MIME_TYPE = "application/vnd.google-apps.document";
        var rootFolderId = '0B7TUAIgyr7KDaUw1X0c3dDlVeEU';

        const apiKey = 'AIzaSyAPv2lxveRF_vRWo8vLY4juoq40CvNDsTM';

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
        vm.listCourses = listCourses;
        vm.listCourseItems = listCourseItems;
        vm.changePage = changePage;
        vm.openMenu = openMenu;

        activate();

        ////////////////////////////////

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

        function listQuestions() {
            getQuestions('1FqmeBTcnVTOTNeXegnXTuczrLTbqtGXh0kO5bXRej2M').then(onThen);

            ///////////////////////////////////////////////////

            function onThen(t) {
                console.log(t);
            }
        }

        function getQuestions(sheetId) {
            return $http({
                method: 'GET',
                url: 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + '/values/A:B?key=' + api
            }).then(successCallback, errorCallback);

            ////////////////////////////////////////

            function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('error in getting questions')
            }

            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log('success in getting questions');

                return response.data.values.map(onMap);

                //////////////////////////////////////////////////

                function onMap(qArray) {
                    var questionTitle = qArray[0];
                    var optionsStr = qArray[1];
                    var questionType = 'checkbox';
                    var numOfAnswers = (optionsStr.match(/[A]/g) || []).length;

                    if (numOfAnswers === 0) {
                        questionType = 'text'
                    } else if (numOfAnswers === 1) {
                        questionType = 'radio'
                    } else {
                        questionType = 'checkbox'
                    }

                    var answers = optionsStr.split('\n').map(onSplitMap);

                    return {
                        type: questionType,
                        name: questionTitle,
                        answers: answers
                    };

                    ///////////////////////////////////////////

                    function onSplitMap(option) {
                        var isAnswer = false;
                        if (option.startsWith('[A]')) {
                            isAnswer = true;
                        }

                        var answer = option.replace('[A]', '');
                        return {
                            name: answer,
                            answer: isAnswer
                        }
                    }
                }
            }
        }

        function listCourseItems(courseId) {
            //list children
            //find content
            listItems(courseId, [
                SPREADSHEET_MIME_TYPE,
                DOCUMENT_MIME_TYPE
            ]).then(onThen);

            ///////////////////////////////////////////////

            function onThen(t) {
                console.log('data in the final block');
                // document with the name of the course is the summary
                //sheet with the name of the course is exam
                //sheet with the same name as document is the homework of that content.
                t.files.forEach(onEach);

                console.log(t.files);

                ///////////////////////////////////////////

                function onEach(file) {
                    file.type = file.mimeType === SPREADSHEET_MIME_TYPE ? 'homework' : 'content'
                }
            }
        }

        function listCourses() {
            listItems(rootFolderId, [FOLDER_MIME_TYPE]).then(onThen);


            /////////////////////////////////////////////////////

            function onThen(t) {
                console.log('data in the final block');
                console.log(t.files);
            }
        }

        function listItems(rootId, mimeTypes) {
            var q = '\'' + rootId + '\' in parents';
            if (mimeTypes !== undefined) {
                var mimeTypeQueries = mimeTypes.map(onMap).join(' or ');
                q += ' and (' + mimeTypeQueries + ')';
            }

            return $http({
                method: 'GET',
                url: 'https://www.googleapis.com/drive/v3/files?q=' + q + '&key=' + apiKey
            }).then(successCallback, errorCallback);

            /////////////////////////////////////////////

            function onMap(mimeType) {
                return ' mimeType = \'' + mimeType + '\'';
            }

            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log('success in getting courses');

                return response.data;
            }

            function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('error in getting courses');
            }
        }

    }
})(angular);
