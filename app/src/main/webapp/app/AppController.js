/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('smartApp')
        .controller('AppController', AppController);

    AppController.$inject = [];
    /* @ngInject */
    function AppController() {
        var vm = this;
    }

})(angular);
