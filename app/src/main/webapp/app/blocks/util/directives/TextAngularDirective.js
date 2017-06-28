/**
 * Developed by Yakup Kaya (yakupkaya@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('customTextAngular', customTextAngularDirective);

    customTextAngularDirective.$inject = [
        '$parse',
        '$timeout',
        'textAngularManager'
    ];


    /* @ngInject */
    function customTextAngularDirective($parse, $timeout, textAngularManager) {
        return {
            bindToController: true,
            controller: CustomTextAngularController,
            templateUrl: 'app/blocks/util/directives/TextAngularView.html',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                name: '@?',
                value: '=',
                rows: '@?',
                toolbar: '@?',
                focus: '@?',
                maxLength: '@?'
            },
            link: link
        };


        function link(scope, element, attributes) {

            // Parse the focus expression
            var shouldFocus = $parse(attributes.focus)(scope);

            if (!shouldFocus) {
                return;
            }

            $timeout(timeout, 0, false);

            function timeout() {
                // Retrieve the scope and trigger focus
                var editor = textAngularManager.retrieveEditor(attributes.name);
                if (editor) {
                    var editorScope = editor.scope;
                    editorScope.displayElements.text.trigger('focus');
                }
            }
        }


    }

    CustomTextAngularController.$inject = [
        '$scope',
        '$element',
        '$attrs'
    ];


    /* @ngInject */
    function CustomTextAngularController($scope, $element, $attrs) {
        var vm = this;
        var defaultToolbarButtons = "[['h1','h2','h3']," +
            "['pre','quote','bold','italics','underline','strikeThrough'], " +
            "['ul','ol'],['undo','redo'],['justifyLeft','justifyCenter','justifyRight','justifyFull']," +
            "['indent','outdent'],['insertImage','insertLink','wordcount','charcount']]";

        if (!vm.name) {
            vm.name = 'textAngularName_' + Date.now();
        }

        if (!vm.toolbar) {
            vm.toolbar = defaultToolbarButtons;
        }

    }

})(angular);
