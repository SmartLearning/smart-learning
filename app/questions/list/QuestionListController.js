/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.question')
        .controller('QuestionListController', QuestionListController);

    QuestionListController.$inject = [
        '$state',
        'GoogleAPI',
        'sheetId'
    ];

    /* @ngInject */
    function QuestionListController($state, GoogleAPI, sheetId) {
        var vm = this;

        vm.items = [];

        vm.submitAnswer = submitAnswer;

        activate();

        ////////////////////////////////////////

        function activate() {
            listQuestions();
        }

        function submitAnswer() {
            // $state.go('question.detail', {id: id}, {reload: true});
            console.log(vm.items);
        }

        function listQuestions() {
            GoogleAPI.questions(sheetId).then(onThen);

            /////////////////////////////////////////////////////

            function onThen(response) {
                console.log('data in the final block', response);
                vm.items = response;
            }
        }
    }

})(angular);
