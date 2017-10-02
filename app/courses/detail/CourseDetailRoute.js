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
                state: 'course.detail',
                config: {
                    url: '/{id}',
                    data: {
                        pageTitle: 'course.title.main'
                    },
                    views: {
                        body: {
                            templateUrl: 'app/courses/detail/CourseDetailView.html',
                            controller: 'CourseDetailController',
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
        return GoogleAPI.items($stateParams.id, [
            AppConstants.SPREADSHEET_MIME_TYPE,
            AppConstants.DOCUMENT_MIME_TYPE
        ]).then(onThen);

        ///////////////////////////////////////////////

        function onThen(t) {
            // document with the name of the course is the summary
            //sheet with the name of the course is exam
            //sheet with the same name as document is the homework of that content.
            t.files.forEach(onEach);

            return t;

            ///////////////////////////////////////////

            function onEach(file) {
                file.type = file.mimeType === AppConstants.SPREADSHEET_MIME_TYPE ? 'homework' : 'content';
            }
        }
    }
})(angular);
