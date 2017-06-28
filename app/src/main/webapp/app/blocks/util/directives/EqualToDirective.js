(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('equalTo', equalToDirective);

    equalToDirective.$inject = [];
    /* @ngInject */
    function equalToDirective() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: "=equalTo"
            },
            link: link
        };
    }

    function link(scope, element, attributes, ngModel) {
        ngModel.$validators.equalTo = function(modelValue) {
            return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
            ngModel.$validate();
        });
    }

})(angular);
