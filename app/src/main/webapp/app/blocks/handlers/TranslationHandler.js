/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('TranslationHandler', TranslationHandlerService);

    TranslationHandlerService.$inject = [
        '$state',
        '$rootScope',
        '$translate',
        '$window'
    ];
    /* @ngInject */
    function TranslationHandlerService($state, $rootScope, $translate, $window) {
        this.initialize = initialize;
        this.updateTitle = updateTitle;

        ////////////////

        function initialize() {
            // if the current translation changes, update the window title
            var translateChangeSuccess = $rootScope.$on(
                '$translateChangeSuccess', function () {
                    updateTitle();
                }
            );

            $rootScope.$on(
                '$destroy', function () {
                    if (angular.isDefined(translateChangeSuccess) && translateChangeSuccess !== null) {
                        translateChangeSuccess();
                    }
                }
            );
        }

        // update the window title using params in the following
        // precendence
        // 1. titleKey parameter
        // 2. $state.$current.data.pageTitle (current state page title)
        // 3. 'global.title'
        function updateTitle(titleKey) {
            if (!titleKey && $state.$current.data && $state.$current.data.pageTitle) {
                titleKey = $state.$current.data.pageTitle;
            }
            $translate(titleKey || 'global.title').then(
                function (title) {
                    $window.document.title = title;
                }
            );
        }
    }

})(angular);
