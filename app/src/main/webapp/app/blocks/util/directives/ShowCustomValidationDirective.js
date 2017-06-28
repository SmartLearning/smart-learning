/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('showCustomValidation', ShowCustomValidationDirective);

    ShowCustomValidationDirective.$inject = [];
    /* @ngInject */
    function ShowCustomValidationDirective() {
        var severityPriority = {
            ERROR: 0,
            WARNING: 1,
            INFORMATION: 2
        };

        return {
            link: link,
            scope: {
                showCustomValidation: '='
            }
        };

        function link(scope, element, attrs) {
            showValidations(element, scope.showCustomValidation);
            scope.$watch('showCustomValidation', function(value){
                if(value){
                    showValidations(element, value);
                }
            });

        }

        function showValidations(element, validations) {
            var severity = null;
            var messages = "";

            //no element nothing to do
            if (!element) {
                return;
            }

            if (angular.isString(validations) && validations.indexOf("{") === 0) {
                validations = angular.fromJson(validations);
            }

            //if there is no validations clean previous affects
            if (!validations) {
                cleanElement(element);
                return;
            }

            for (var rule in validations) {
                if (!validations.hasOwnProperty(rule)) {
                    continue;
                }
                severity = getPrioritizedSeverity(validations[rule].severity, severity);
                messages = messages && messages.length > 0 ? messages.concat("\n", validations[rule].message) : validations[rule].message;
            }

            if (severity && messages && severityPriority[severity] > -1) {
                element.attr('title', messages);
                element.addClass('severity-' + severity.toLowerCase());
            } else {
                cleanElement(element);
            }
        }

        function cleanElement(element) {
            //if previous validation has left something
            if (element.attr('title')) {
                element.removeAttr('title');
            }
            element.removeClass('severity-info');
            element.removeClass('severity-warning');
            element.removeClass('severity-error');
        }

        function getPrioritizedSeverity(newSeverity, severity) {
            if (!newSeverity) {
                return severity;
            }
            if (!severity) {
                return newSeverity;
            }
            return severityPriority[newSeverity.toUpperCase()] < severityPriority[severity.toUpperCase()] ? newSeverity : severity;
        }
    }

})(angular);
