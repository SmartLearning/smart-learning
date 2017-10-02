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
                state: 'question.list',
                config: {
                    url: '',
                    data: {
                        authorities: [],
                        pageTitle: 'question.title.main'
                    },
                    views: {
                        body: {
                            templateUrl: 'app/questions/list/QuestionListView.html',
                            controller: 'QuestionListController',
                            controllerAs: 'vm'
                        }
                    }
                }
            }
        ];
    }
})(angular);
