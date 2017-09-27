/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.question')
        .controller('QuestionDetailController', QuestionDetailController);

    QuestionDetailController.$inject = [
        '$state',
        'AppConstants',
        'model'
    ];

    /* @ngInject */
    function QuestionDetailController($state, AppConstants, model) {
        var vm = this;

        vm.model = model;

        activate();

        ////////////////////////////////////////

        function activate() {
        }
    }

})(angular);
