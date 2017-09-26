/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.course')
        .controller('CourseController', CourseController);

    CourseController.$inject = [
        'AppConstants',
        'GoogleAPI'
    ];

    /* @ngInject */
    function CourseController(AppConstants, GoogleAPI) {
        var vm = this;

        vm.items = [];

        activate();

        ////////////////////////////////////////

        function activate() {
            listCourses();
        }

        function listCourses() {
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
