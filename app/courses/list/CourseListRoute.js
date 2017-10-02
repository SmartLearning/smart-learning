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
                state: 'course.list',
                config: {
                    url: '',
                    data: {
                        authorities: [],
                        pageTitle: 'course.title.main'
                    },
                    views: {
                        body: {
                            templateUrl: 'app/courses/list/CourseListView.html',
                            controller: 'CourseListController',
                            controllerAs: 'vm'
                        }
                    }
                }
            }
        ];
    }
})(angular);
