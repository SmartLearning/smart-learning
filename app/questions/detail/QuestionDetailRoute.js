/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.question')
        .run(runQuestion);

    runQuestion.$inject = ['routerHelper'];

    /* @ngInject */
    function runQuestion(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'questions.detail',
                config: {
                    url: '/{id}',
                    data: {
                        pageTitle: 'question.title.main'
                    },
                    views: {
                        body: {
                            templateUrl: 'app/questions/detail/QuestionDetailView.html',
                            controller: 'QuestionDetailController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        model: model
                    }
                }
            }
        ];
    }

    model.$inject = [
        '$stateParams',
        'AppConstants',
        'GoogleAPI'
    ];

    /* @ngInject */
    function model($stateParams, AppConstants, GoogleAPI) {
        if (!$stateParams.id) {
            return null;
        }

        //list children
        //find content
        return GoogleAPI.questions($stateParams.id, [
            AppConstants.SPREADSHEET_MIME_TYPE,
            AppConstants.DOCUMENT_MIME_TYPE
        ]).then(onThen);

        ///////////////////////////////////////////////

        function onThen(t) {
            t.files.forEach(onEach);

            return t;

            ///////////////////////////////////////////

            function onEach(file) {
                file.type = file.mimeType === AppConstants.SPREADSHEET_MIME_TYPE ? 'homework' : 'content';
            }
        }
    }
})(angular);
