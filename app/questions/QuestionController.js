/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.question')
        .controller('QuestionController', QuestionController);

    QuestionController.$inject = [];

    /* @ngInject */
    function QuestionController() {
        var vm = this;

        activate();

        ////////////////////////////////////////

        function activate() {
        }
    }

})(angular);
