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
        'model'
    ];

    /* @ngInject */
    function CourseDetailController($state, AppConstants, model) {
        var vm = this;

        vm.model = model;

        vm.goToItem = goToItem;

        activate();

        ////////////////////////////////////////

        function activate() {
        }

        function goToItem(item) {
            if (item.mimeType === AppConstants.DOCUMENT_MIME_TYPE) {
                $state.go('contents', {id: item.id}, {reload: true});
            }
        }
    }

})(angular);
