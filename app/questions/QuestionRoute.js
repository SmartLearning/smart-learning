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
                state: 'question',
                config: {
                    url: '/questions/{sheetId}',
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
                        language: language,
                        sheetId: sheetId
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

    sheetId.$inject = ['$stateParams'];

    /* @ngInject */
    function sheetId($stateParams) {
        return $stateParams.sheetId;
    }
})(angular);
