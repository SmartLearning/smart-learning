/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.course')
        .run(runCourse);

    runCourse.$inject = ['routerHelper'];

    /* @ngInject */
    function runCourse(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'course',
                config: {
                    url: '/',
                    parent: 'app',
                    data: {
                        authorities: [],
                        pageTitle: 'course.title.main',
                        menu: {
                            icon: 'course',
                            text: 'global.menu.course',
                            groupOrder: -20
                        }
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/courses/CourseView.html',
                            controller: 'CourseController',
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
        $translatePartialLoader.addPart('course');
        return $translate.refresh();
    }
})(angular);
