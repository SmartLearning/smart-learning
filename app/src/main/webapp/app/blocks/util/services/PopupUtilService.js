/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('PopupUtil', PopupUtilService);

    PopupUtilService.$inject = [
        '$mdDialog',
        'UrlUtil'
    ];
    /* @ngInject */
    function PopupUtilService($mdDialog, UrlUtil) {
        this.showImagePopup = showImagePopup;
        this.showImagesPaginationPopup = showImagesPaginationPopup;

        ///////////////////////////////////////////////////////

        function showImagePopup(scope, imageUrl) {
            if (!UrlUtil.isUrl(imageUrl) && !UrlUtil.isImageUri(imageUrl) && !UrlUtil.isFileCloudUrl(imageUrl) && !UrlUtil.isLocalStorageUrl(imageUrl)) {
                //invalid url do try to show image
                return;
            }
            $mdDialog.show(
                {
                    clickOutsideToClose: true,
                    scope: scope,
                    preserveScope: true,
                    template: '<md-dialog ng-mouseleave="closeDialog()" aria-label="Image Dialog">' +
                    '  <md-dialog-content layout-align="center center">' +
                    '<img ng-src="' + imageUrl + '" alt="" error-src="content/images/no_image_icon.gif">' +
                    '  </md-dialog-content>' +
                    '</md-dialog>',
                    controller: function ImageDialogController($scope, $mdDialog) {
                        $scope.closeDialog = function () {
                            $mdDialog.hide();
                        };
                    }
                }
            );
        }

        function showImagesPaginationPopup(images) {
            if (!angular.isArray(images) || images.length === 0) {
                //invalid url do try to show image
                return;
            }

            $mdDialog.show(
                {
                    clickOutsideToClose: true,
                    templateUrl: 'app/blocks/util/services/PopupImagesPaginationView.html',
                    controller: ImagesPaginationDialogController,
                    controllerAs: 'vm',
                    bindToController: true,
                    locals: {
                        images: images
                    }
                }
            );

            ///////////////////////////////////////////////

            ImagesPaginationDialogController.$inject = ['$mdDialog'];
            /* @ngInject */
            function ImagesPaginationDialogController($mdDialog) {
                var vm = this;

                vm.next = next;
                vm.previous = previous;
                vm.close = $mdDialog.hide;

                vm.index = 0;
                vm.isFirst = true;
                vm.isEnd = vm.images.length < 2;

                //////////////////////////////////////////

                function previous() {
                    if (vm.index > 0) {
                        vm.index--;
                    }
                    updateArrow();
                }

                function next() {
                    if (vm.index < vm.images.length) {
                        vm.index++;
                    }
                    updateArrow();
                }

                function updateArrow() {
                    vm.isEnd = vm.index === vm.images.length - 1;
                    vm.isFirst = vm.index === 0;
                }
            }
        }
    }

})(angular);
