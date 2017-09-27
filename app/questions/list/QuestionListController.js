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
        'AppConstants',
        'GoogleAPI'
    ];

    /* @ngInject */
    function QuestionListController($state, AppConstants, GoogleAPI) {
        var vm = this;

        vm.items = [];

        vm.goToItem = goToItem;

        activate();

        ////////////////////////////////////////

        function activate() {
            listQuestions();
        }

        function goToItem(id) {
            $state.go('questions.detail', {id: id}, {reload: true});
        }

        function listQuestions() {
            GoogleAPI.items(AppConstants.ROOT_FOLDER_ID, [AppConstants.FOLDER_MIME_TYPE]).then(onThen);


            /////////////////////////////////////////////////////

            function onThen(t) {
                console.log('data in the final block');
                console.log(t.files);
                vm.items = t.files;
            }
        }

    }

})(angular);
