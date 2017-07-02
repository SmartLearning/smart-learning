/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .provider('Alert', AlertProvider);

    AlertProvider.$inject = [];
    /* @ngInject */
    function AlertProvider() {
        var $this = this;
        $this.toast = false;
        /* jshint validthis:true */
        $this.showAsToast = showAsToast;

        $this.$get = Alert;

        Alert.$inject = [
            '$timeout',
            '$sce',
            '$translate',
            '$injector'
        ];
        /* @ngInject */
        function Alert($timeout, $sce, $translate, $injector) {
            var toast = this.toast,
                alertId = 0, // unique id for each alert. Starts from 0.
                alerts = [],
                defaultTimeout = 5000; // default timeout

            return {
                factory: factory,
                isToast: isToast,
                add: addAlert,
                closeAlert: closeAlert,
                closeAlertByIndex: closeAlertByIndex,
                handleServerResponse: handleServerResponse,
                clear: clear,
                get: get,
                confirm: confirm,
                deleteConfirmation: deleteConfirmation,
                success: success,
                error: error,
                info: info,
                alreadyAdded: alreadyAdded
            };

            /////////////////////

            function isToast() {
                return toast;
            }

            function clear() {
                alerts.length = 0;
            }

            function get() {
                return alerts;
            }

            function getTimeout(timeout) {
                if (!timeout && timeout !== 0) {
                    return defaultTimeout;
                }
                return timeout;
            }

            function deleteConfirmation(event, title, message, okButtonMessage, cancelButtonMessage, variable) {
                return confirm(
                    event,
                    title || 'global.delete.title',
                    message || 'global.delete.message',
                    okButtonMessage || 'global.delete.buttons.delete',
                    cancelButtonMessage || 'global.delete.buttons.cancel',
                    variable
                );
            }

            function success(msg, params, timeout, toast, usingMessageFormat) {
                return this.add(
                    {
                        type: 'accent',
                        msg: msg,
                        params: params,
                        usingMessageFormat: usingMessageFormat,
                        timeout: getTimeout(timeout),
                        toast: toast || isToast()
                    }
                );
            }

            function confirm(event, title, message, okButtonMessage, cancelButtonMessage, usingMessageFormat) {
                var $mdDialog = $injector.get('$mdDialog');
                var messageFormat = usingMessageFormat ? 'messageformat' : null;

                var text = {
                    title: $translate.instant(title, null, messageFormat),
                    message: $translate.instant(message, null, messageFormat),
                    okButtonMessage: $translate.instant(okButtonMessage, null, messageFormat),
                    cancelButtonMessage: $translate.instant(cancelButtonMessage, null, messageFormat)
                };
                var confirm = $mdDialog.confirm()
                    .title(text.title)
                    .textContent(text.message)
                    .ariaLabel(text.message)
                    .targetEvent(event)
                    .ok(text.okButtonMessage)
                    .cancel(text.cancelButtonMessage);
                return $mdDialog.show(confirm);
            }

            function error(msg, params, timeout, toast, usingMessageFormat) {
                return this.add(
                    {
                        type: 'warn',
                        msg: msg,
                        params: params,
                        usingMessageFormat: usingMessageFormat,
                        timeout: getTimeout(timeout),
                        toast: toast || isToast()
                    }
                );
            }

            function info(msg, params, timeout, toast, usingMessageFormat) {
                return this.add(
                    {
                        type: 'primary',
                        msg: msg,
                        params: params,
                        usingMessageFormat: usingMessageFormat,
                        timeout: getTimeout(timeout),
                        toast: toast || isToast()
                    }
                );
            }

            function factory(alertOptions) {
                var alert = {
                    type: alertOptions.type,
                    msg: $sce.trustAsHtml(alertOptions.msg),
                    id: alertOptions.alertId,
                    timeout: alertOptions.timeout,
                    toast: alertOptions.toast,
                    position: alertOptions.position ? alertOptions.position : 'top right',
                    scoped: alertOptions.scoped,
                    close: function (alerts) {
                        return closeAlert(this.id, alerts);
                    }
                };
                if (!alert.scoped && !alreadyAdded(alert)) {
                    alerts.push(alert);
                }
                //TODO: this usage is wrong, we have to fix it later...
                return alert;
            }

            function alreadyAdded(alert) {
                return alerts.filter(function (item) {
                        return item.msg.toString() === alert.msg.toString()
                    }).length > 0;
            }

            function addAlert(alertOptions, extAlerts) {
                var format = alertOptions.usingMessageFormat ? 'messageformat' : null;
                alertOptions.alertId = alertId++;
                if (alertOptions.toast) {
                    var $mdToast = $injector.get('$mdToast');
                    $mdToast.show(
                        {
                            templateUrl: 'app/blocks/util/directives/AlertProviderDialogTemplate.html',
                            bindToController: true,
                            controller: ToastController,
                            controllerAs: 'vm',
                            hideDelay: alertOptions.timeout,
                            position: 'top right',
                            locals: {
                                content: alertOptions.msg,
                                params: alertOptions.params,
                                type: alertOptions.type,
                                interpolation: format
                            }
                        }
                    );

                    return;
                }

                alertOptions.msg = $translate.instant(alertOptions.msg, alertOptions.params, format);
                var that = this;
                var alert = this.factory(alertOptions);
                if (alertOptions.timeout && alertOptions.timeout > 0) {
                    $timeout(
                        function () {
                            that.closeAlert(alertOptions.alertId, extAlerts);
                        }, alertOptions.timeout
                    );
                }
                return alert;
            }

            function closeAlert(id, extAlerts) {
                var thisAlerts = extAlerts ? extAlerts : alerts;
                return closeAlertByIndex(
                    thisAlerts.map(
                        function (e) {
                            return e.id;
                        }
                    ).indexOf(id), thisAlerts
                );
            }

            function closeAlertByIndex(index, thisAlerts) {
                return thisAlerts.splice(index, 1);
            }

            function handleServerResponse(httpResponse) {
                var errors = [];
                var status = Math.floor(httpResponse.status / 100);
                var result = httpResponse.data;
                switch (status) {
                    // connection refused, server not reachable
                    case 0:
                    case -1:
                        errors.push(
                            {
                                key: 'error.server.not.reachable'
                            }
                        );
                        break;

                    case 4:
                        var errorHeader = httpResponse.headers('X-smartApp-error');
                        var errorParams = httpResponse.headers('X-smartApp-params');
                        if (errorHeader) {
                            errors.push(
                                {
                                    message: errorHeader,
                                    params: angular.fromJson(errorParams),
                                    timeout: 3000
                                }
                            );
                        } else if (result && result.fieldErrors) {
                            for (var i = 0; i < result.fieldErrors.length; i++) {
                                var fieldError = result.fieldErrors[i];
                                // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                                var convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                                var key = fieldError.objectName + '.errors.' + ('' + fieldError.message).toLowerCase() + '.' + convertedField;
                                errors.push(
                                    {
                                        message: $translate.instant(key)
                                    }
                                );
                            }
                        } else if (result && result.message) {
                            var message = result.message;
                            if (result.description) {
                                message = $translate.instant(message) + " : " + result.description;
                            }
                            errors.push(
                                {
                                    message: message,
                                    params: result,
                                    timeout: 3000
                                }
                            );
                        } else if (result && result.AuthenticationException) {
                            errors.push(
                                {
                                    message: result.AuthenticationException
                                }
                            );
                        } else {
                            if (typeof result === 'string' && result.length === 0) {
                                return;
                            }
                            errors.push(
                                {
                                    message: angular.fromJson(result),
                                    timeout: 3000
                                }
                            );
                        }
                        break;
                    case 5:
                        var errorHeader = httpResponse.headers('X-smartApp-error');
                        var errorParams = httpResponse.headers('X-smartApp-params');
                        if (errorHeader) {
                            errors.push(
                                {
                                    message: errorHeader,
                                    params: angular.fromJson(errorParams)
                                }
                            );
                        } else if (result && result.fieldErrors) {
                            for (var i = 0; i < result.fieldErrors.length; i++) {
                                var fieldError = result.fieldErrors[i];
                                // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                                var convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                                var key = fieldError.objectName + '.errors.' + ('' + fieldError.message).toLowerCase() + '.' + convertedField;
                                errors.push(
                                    {
                                        message: $translate.instant(key)
                                    }
                                );
                            }
                        } else if (result && result.message) {
                            errors.push(
                                {
                                    message: result.message,
                                    params: result
                                }
                            );
                        } else {
                            errors.push(
                                {
                                    message: result
                                }
                            );
                        }
                        break;

                    default:
                        if (result && result.message) {
                            errors.push(
                                {
                                    message: result.message
                                }
                            );
                        } else {
                            errors.push(
                                {
                                    message: angular.toJson(result, true)
                                }
                            );
                        }
                }

                return errors;
            }

        }

        function showAsToast(isToast) {
            $this.toast = isToast;
        }

        ToastController.$inject = ['$mdToast'];
        /* @ngInject */
        function ToastController($mdToast) {
            var vm = this;

            vm.close = close;

            ////////////

            function close() {
                $mdToast.hide();
            }
        }
    }

})(angular);
