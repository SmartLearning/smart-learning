/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.content')
        .run(runCourse);

    runCourse.$inject = ['routerHelper'];

    /* @ngInject */
    function runCourse(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'content',
                config: {
                    url: '/contents/{id}',
                    parent: 'app',
                    data: {
                        pageTitle: 'content.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/contents/ContentView.html',
                            controller: 'ContentController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language,
                        id: id
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
        $translatePartialLoader.addPart('content');
        return $translate.refresh();
    }

    id.$inject = ['$stateParams'];

    /* @ngInject */
    function id($stateParams) {
        return $stateParams.id;
    }
})(angular);
