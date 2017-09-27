/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.course')
        .controller('CourseController', CourseController);

    CourseController.$inject = [];

    /* @ngInject */
    function CourseController() {
        var vm = this;

        activate();

        ////////////////////////////////////////

        function activate() {
        }
    }

})(angular);
