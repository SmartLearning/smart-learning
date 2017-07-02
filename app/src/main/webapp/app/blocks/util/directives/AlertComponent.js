/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .component(
            'alert', {
                templateUrl: 'app/blocks/util/directives/AlertComponentView.html',
                controller: AlertController,
                controllerAs: 'vm',
                bindings: {
                    toast: '=',
                    timeout: '@',
                    catchServerError: '@'
                }
            }
        );

    AlertController.$inject = [
        '$rootScope',
        '$scope',
        'Alert'
    ];
    /* @ngInject */
    function AlertController($rootScope, $scope, Alert) {
        var vm = this;

        activate();

        function activate() {
            vm.alerts = Alert.get();
            listenToServerError();
        }

        function listenToServerError() {
            if (!vm.timeout && vm.timeout !== 0) {
                vm.timeout = 5000;
            }

            if (vm.catchServerError !== false) {
                vm.catchServerError = true;
            }

            var cleanHttpErrorListener = $rootScope.$on(
                'smartApp.httpError', function (event, response) {
                    event.stopPropagation();
                    if (!vm.catchServerError) {
                        return;
                    }
                    var errors = Alert.handleServerResponse(response);
                    angular.forEach(
                        errors, function (item) {
                            if (!item || !item.message || (angular.isString(item.message) && item.message.trim() === '')) {
                                return;
                            }
                            addServerErrorAlert(item);
                        }
                    );
                }
            );
            $scope.$on(
                '$destroy', function () {
                    if (vm.catchServerError || angular.isDefined(cleanHttpErrorListener) && cleanHttpErrorListener !== null) {
                        cleanHttpErrorListener();

                        vm.alerts = [];//TODO: should handle state change and clear all the messages
                    }
                }
            );
        }

        function addServerErrorAlert(response) {
            if (response.params) {
                if (response.params.exception === 'com.netflix.zuul.exception.ZuulException') {
                    return;
                }
            }

            var alert = Alert.add(
                {
                    type: 'warn',
                    msg: response.message,
                    params: response.params,
                    timeout: response.timeout || 0,
                    toast: vm.toast,
                    scoped: true
                },
                vm.alerts
            );

            if (!vm.toast && !Alert.alreadyAdded(alert)) {
                vm.alerts.push(alert);
            }
        }
    }
})(angular);
