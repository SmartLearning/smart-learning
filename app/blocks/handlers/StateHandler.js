/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('StateHandler', StateHandlerService);

    StateHandlerService.$inject = [
        '$mdDialog',
        '$rootScope',
        '$state',
        '$translate',
        'Language',
        'TranslationHandler',
        'Alert',
        'DEBUG_INFO_ENABLED',
        'VERSION'
    ];

    /* @ngInject */
    function StateHandlerService($mdDialog, $rootScope, $state, $translate, Language, TranslationHandler, Alert, DEBUG_INFO_ENABLED, VERSION) {
        this.initialize = initialize;

        ////////////////

        function initialize() {
            $rootScope.DEBUG_INFO_ENABLED = DEBUG_INFO_ENABLED;
            $rootScope.VERSION = VERSION;
            $rootScope.back = back;

            var stateChangeStart = $rootScope.$on('$stateChangeStart', onChangeStart);
            var stateChangeSuccess = $rootScope.$on('$stateChangeSuccess', onChangeSuccess);

            $rootScope.$on('$destroy', onDestroy);

            ////////////////////////////////////////////////////////////////

            function back() {
                // If previous state is 'activate' or do not exist go to 'home'
                if ($rootScope.previousStateName === 'activation' ||
                    $rootScope.previousStateName === null ||
                    $state.get($rootScope.previousStateName) === null) {
                    $state.go('home');
                } else {
                    $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
                }
            }

            function onChangeSuccess(event, toState, toParams, fromState, fromParams) {
                var titleKey = 'global.title';

                //clear alerts
                Alert.clear();

                // Remember previous state unless we've been redirected to login or we've just
                // reset the state memory after logout. If we're redirected to login, our
                // previousState is already set in the authExpiredInterceptor. If we're going
                // to login directly, we don't want to be sent to some previous state anyway
                if (!$rootScope.redirected && $rootScope.previousStateName) {
                    $rootScope.previousStateName = fromState.name;
                    $rootScope.previousStateParams = fromParams;
                }

                // Set the page title key to the one configured in state or use default one
                if (toState.data.pageTitle) {
                    titleKey = toState.data.pageTitle;
                }
                TranslationHandler.updateTitle(titleKey);
                $mdDialog.hide();
            }

            function onDestroy() {
                if (angular.isDefined(stateChangeStart) && stateChangeStart !== null) {
                    stateChangeStart();
                }
                if (angular.isDefined(stateChangeSuccess) && stateChangeSuccess !== null) {
                    stateChangeSuccess();
                }
            }

            function onChangeStart(event, toState, toStateParams) {
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                // Update the language
                Language.getCurrent().then($translate.use);
            }
        }
    }

})(angular);
