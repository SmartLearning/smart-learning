/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('dynamicController', DynamicControllerDirective);

    DynamicControllerDirective.$inject = [
        '$parse',
        '$mdCompiler'
    ];
    /* @ngInject */
    function DynamicControllerDirective($parse, $mdCompiler) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 100000,
            link: link
        };

        ///////////////////////////////////////////

        function link(scope, elem) {
            // Compile the element with the ng-controller attribute
            var url = elem.attr('template-url') || null;
            if (!url) {
                return;
            }

            url = $parse(url)(scope);
            var name = elem.attr('dynamic-controller');
            var controller = null;
            var model = null;
            var as = null;

            if (name) {
                var data = elem.attr('controller-data');
                controller = $parse(name)(scope);
                as = elem.attr('controller-as');

                elem.removeAttr('dynamic-controller');
                elem.removeAttr('controller-data');
                elem.removeAttr('controller-as');
                elem.removeAttr('template-url');

                if (data) {
                    model = $parse(data)(scope);
                }
            }

            var config = {
                templateUrl: url,
                controller: controller,
                controllerAs: as,
                locals: {model: model}
            };
            $mdCompiler.compile(config).then(onThen);

            //////////////////////////////////////////////

            function onThen(compileData) {
                compileData.link(scope);
                elem.html(compileData.element);
            }
        }

    }

})(angular);

