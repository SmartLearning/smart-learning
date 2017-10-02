/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.course')
        .controller('CourseListController', CourseListController);

    CourseListController.$inject = [
        '$state',
        'AppConstants',
        'GoogleAPI'
    ];

    /* @ngInject */
    function CourseListController($state, AppConstants, GoogleAPI) {
        var vm = this;

        vm.items = [];

        vm.goToItem = goToItem;

        activate();

        ////////////////////////////////////////

        function activate() {
            listCourses();
        }

        function goToItem(id) {
            $state.go('course.detail', {id: id}, {reload: true});
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
