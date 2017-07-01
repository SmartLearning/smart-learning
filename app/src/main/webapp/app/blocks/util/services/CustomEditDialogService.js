/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular.module('app.blocks')
        .service('CustomEditDialog', CustomEditDialogService)
        .controller('CustomEditDialogController', CustomEditDialogController);

    CustomEditDialogService.$inject = [
        '$document',
        '$mdEditDialog'
    ];
    /* @ngInject */
    function CustomEditDialogService($document, $mdEditDialog) {
        var ESCAPE = 27;
        var body = angular.element($document.prop('body'));

        this.showDialog = showDialog;

        function showDialog(options) {
            options = angular.extend({}, options, build('small', options));
            var promise = $mdEditDialog.show(options);
            promise.then(onThen);

            ////////////////////////////////////////////////////////

            function onThen(ctrl) {
                var backdrop = angular.element('body').find('md-backdrop.md-edit-dialog-backdrop');
                if (options.clickOutsideToClose) {
                    clickOutsideToClose(backdrop, ctrl.getElement(), ctrl.getInput(), options.afterOutsideToClose);
                }
                escToClose(ctrl.getElement(), ctrl.getInput(), options.afterEscToClose);


                ////////////////////////////////////////////////////////

                function clickOutsideToClose(backdrop, element, input, afterClose) {
                    backdrop.on('click', onClick);

                    ///////////////////////////////////////////////

                    function onClick() {
                        element.remove();
                        if (angular.isFunction(afterClose)) {
                            afterClose(input.$modelValue);
                        }
                    }
                }

                function escToClose(element, input, onClose) {
                    var keyup = onKeyUp;

                    body.on('keyup', keyup);

                    element.on('$destroy', onDestroy);

                    ////////////////////////////////////////////////////

                    function onKeyUp(event) {
                        if (event.keyCode === ESCAPE) {
                            element.remove();
                            if (angular.isFunction(onClose)) {
                                onClose(input.$modelValue);
                            }
                        }
                    }

                    function onDestroy() {
                        body.off('keyup', keyup);
                    }
                }
            }

            function build(size, options) {
                return {
                    bindToController: true,
                    controller: 'CustomEditDialogController',
                    controllerAs: 'vm',
                    escToClose: true,
                    clickOutsideToClose: true,
                    focusOnOpen: true,
                    locals: {
                        save: options.save
                    },
                    scope: {
                        cancel: options.cancel || 'global.cancel',
                        messages: options.messages,
                        model: options.modelValue,
                        getType: getType,
                        ok: options.ok || 'global.save',
                        placeholder: options.placeholder,
                        title: options.title,
                        size: size
                    },
                    templateUrl: 'app/blocks/util/services/CustomEditDialogView.html'
                };

                ////////////////////////////////////////////////

                function getType() {
                    var type = ("" + options.type).toLowerCase();
                    if (type === 'boolean') {
                        return 'checkbox';
                    }
                    return 'text';
                }
            }
        }
    }

    CustomEditDialogController.$inject = [
        '$scope',
        '$element',
        '$q',
        'save'
    ];
    /* @ngInject */
    function CustomEditDialogController($scope, $element, $q, save) {
        var vm = this;

        vm.dismiss = dismiss;
        vm.getInput = getInput;
        vm.getElement = getElement;

        $scope.submit = submit;

        //////////////////////////////////////////////

        function submit() {
            update().then(vm.dismiss);

            //////////////////////////////////////////

            function update() {
                if ($scope.editDialog.$invalid) {
                    return $q.reject();
                }

                if (angular.isFunction(save)) {
                    return $q.when(save($scope.editDialog.input));
                }

                return $q.resolve();
            }
        }

        function dismiss() {
            $element.remove();
        }

        function getElement() {
            return $element;
        }

        function getInput() {
            return $scope.editDialog.input;
        }
    }
})(angular);
