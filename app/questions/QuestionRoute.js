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
                state: 'questions',
                config: {
                    url: '/questions',
                    abstract: true,
                    parent: 'app',
                    data: {
                        pageTitle: 'question.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/questions/QuestionView.html',
                            controller: 'QuestionController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language
                    }
                }
            }
        ];
    }

    language.$inject = [
        '$translate',
        '$translatePartialLoader'
    ];

    /* @ngInject */
    function language($translate, $translatePartialLoader) {
        $translatePartialLoader.addPart('question');
        return $translate.refresh();
    }
})(angular);
