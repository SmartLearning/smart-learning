(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('RichTextEditDialog', RichTextEditDialogService)
        .controller('RichTextEditDialogController', RichTextEditDialogController);

    RichTextEditDialogService.$inject = ['$rootScope', '$mdDialog'];
    /* @ngInject */
    function RichTextEditDialogService($rootScope, $mdDialog) {
        this.showDialog = showDialog;

        ////////////////

        function showDialog(options) {
            options = angular.extend({}, options, build(options));
            var promise = $mdDialog.show(options);
            promise.finally(function(text) {
                //if anything to make after promise is resolved

            });
        }

        function build(options) {
            var textEditDialogScope = $rootScope.$new(true);
            textEditDialogScope.model = options.modelValue;
            textEditDialogScope.title = options.title;
            return {
                bindToController: true,
                controller: 'RichTextEditDialogController',
                controllerAs: 'vm',
                escapeToClose: false,
                clickOutsideToClose: true,
                focusOnOpen: true,
                templateUrl: 'app/blocks/util/services/RichTextEditDialogView.html',
                locals: {
                    onSave: options.onSave
                },
                scope: textEditDialogScope
            }
        }
    }

    RichTextEditDialogController.$inject = ['$scope', '$mdDialog', '$q', 'onSave'];
    /* @ngInject */
    function RichTextEditDialogController($scope, $mdDialog, $q, onSave) {
        var vm = this;

        vm.model = $scope.model;
        vm.title = $scope.title;
        vm.dismiss = dismiss;
        vm.save = save;
        vm.resolvedWithSave = false;

        activate();

        function activate() {
            //on any close try to save
            $scope.$on('$destroy', function() {
                if(angular.isFunction(onSave) && !vm.resolvedWithSave) {
                    onSave(vm.model);
                }
            });
        }

        function update() {
            if(angular.isFunction(onSave)) {
                vm.resolvedWithSave = true;
                return $q.when(onSave(vm.model));
            }
            return $q.resolve();
        }

        function dismiss() {
            $mdDialog.hide();
        }

        function save() {
            update().then(function () {
                vm.dismiss();
            });
        }
    }

})(angular);
