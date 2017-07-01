/* Help configure the state-base ui.router */
(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .provider('routerHelper', routerHelperProvider);

    routerHelperProvider.$inject = [
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider'
    ];
    /* @ngInject */
    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
        /* jshint validthis:true */
        var config = {
            pageTitle: undefined,
            resolveAlways: {}
        };

        //$locationProvider.html5Mode(true);

        this.configure = function (cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;

        RouterHelper.$inject = [
            '$location',
            '$window',
            '$rootScope',
            '$state',
            '$translate',
            '$translatePartialLoader',
            '$filter',
            'Alert'
        ];
        /* @ngInject */
        function RouterHelper($location, $window, $rootScope, $state, $translate, $translatePartialLoader, $filter, Alert) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                stateCounts: stateCounts
            };

            init();

            return service;

            ///////////////

            function configureStates(states, otherwisePath) {
                states.forEach(forEach);
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }

                /////////////////////////////////////////////

                function forEach(item) {
                    item.config.resolve = angular.extend(item.config.resolve || {}, config.resolveAlways);
                    $stateProvider.state(item.state, item.config);
                }
            }

            function init() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError', stateChangeError);
                $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
            }

            function getStates() {
                return $state.get();
            }

            function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
                if (handlingStateChangeError) {
                    return;
                }
                stateCounts.errors++;
                handlingStateChangeError = true;
                var destination = (toState &&
                    (toState.data.pageTitle || toState.name || toState.loadedTemplateUrl)) ||
                    'unknown target';

                $translatePartialLoader.addPart('global');
                $translate.refresh().then(onRefresh);

                ///////////////////////////////////////////////////////////////

                function onRefresh() {
                    $translate('global.route.failed').then(onSuccess, console.log);

                    ///////////////////////////////////////////////////////////////

                    function onSuccess(message) {
                        var msg = $filter('format')(
                            message,
                            destination,
                            (error.data || ''),
                            (error.statusText || ''),
                            (error.status || ''),
                            (error || '')
                        );
                        Alert.warning(msg, [toState]);
                        $location.path('/');
                    }
                }
            }

            function stateChangeSuccess(event, toState) {
                stateCounts.changes++;
                handlingStateChangeError = false;
                var title = config.pageTitle + ' ' + (toState.title || '');
                $translate(title || 'global.access.title').then(onSuccess);

                ////////////////////////////////////////////////////////

                function onSuccess(title) {
                    $window.document.title = title;
                    $rootScope.title = title;
                }
            }
        }
    }
})(angular);
