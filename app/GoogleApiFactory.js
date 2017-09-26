/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('smartApp')
        .factory('GoogleAPI', GoogleAPIFactory);

    GoogleAPIFactory.$inject = [
        '$http',
        'AppConstants'
    ];

    /* @ngInject */
    function GoogleAPIFactory($http, AppConstants) {
        return {
            items: listItems,
            questions: getQuestions
        };

        ///////////////////////////////////////////////////

        function getQuestions(sheetId) {
            return $http({
                method: 'GET',
                url: 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + '/values/A:B?key=' + AppConstants.API_KEY
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

        function listItems(rootId, mimeTypes) {
            var q = '\'' + rootId + '\' in parents';
            if (mimeTypes !== undefined) {
                var mimeTypeQueries = mimeTypes.map(onMap).join(' or ');
                q += ' and (' + mimeTypeQueries + ')';
            }

            return $http({
                method: 'GET',
                url: 'https://www.googleapis.com/drive/v3/files?q=' + q + '&key=' + AppConstants.API_KEY
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

