/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.course')
        .controller('CourseDetailController', CourseDetailController);

    CourseDetailController.$inject = [
        '$state',
        'AppConstants',
        'GoogleAPI'
    ];

    /* @ngInject */
    function CourseDetailController($state, AppConstants, GoogleAPI, model) {
        var vm = this;

        vm.model = model;
        console.log(model);

        vm.goToItem = goToItem;

        activate();

        ////////////////////////////////////////

        function activate() {
        }

        function goToItem(id) {
            $state.go('courses', {id: id}, {reload: true});
        }
    }

})(angular);
