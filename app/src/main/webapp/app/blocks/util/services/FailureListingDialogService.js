(function(angular){
    'use strict';

    angular.module('app.blocks')
        .service('FailureListingDialog', FailureListingDialogService)
        .controller('FailureListingDialogController', FailureListingDialogController);

    FailureListingDialogService.$inject = ['$document', '$mdDialog', '$translate', '$filter', 'Matching'];
    /* @ngInject */
    function FailureListingDialogService($document, $mdDialog, $translate, $filter, Matching) {
        var body = angular.element($document.prop('body'));
        this.getListingFailure = getListingFailure;

        function getListingFailure(merchant, hbSku) {
            return Matching.getByMerchantAndHbSku(
                {
                    merchant: merchant,
                    hbsku: hbSku
                }, successLoad, failLoad
            ).$promise;

            function failLoad() {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(body)
                        .clickOutsideToClose(true)
                        .title($translate.instant('product.listing.warn.title'))
                        .textContent($translate.instant('product.listing.warn.message'))
                        .ok('OK')
                );
            }

            function successLoad(data) {
                $mdDialog.show({
                    controller: FailureListingDialogController,
                    templateUrl: 'app/blocks/util/services/FailureListingDialogView.html',
                    parent: body,
                    clickOutsideToClose: true,
                    locals: {
                        listingData : {
                            errorMessage: $translate.instant('product.listing.status.errorMessage', {errorMessage:$translate.instant('product.listing.error.'+data.messageKey)}),
                            tryCount : $translate.instant('product.listing.status.tryCount', {tryCount:data.tryCount}),
                            createdAt : $translate.instant('product.listing.status.createdAt', {createdAt:$filter('date')(data.createdAt, 'dd/MM/yy HH:mm:ss')})
                        },
                        tryCount : data.tryCount
                    }
                });
            }
        }
    }

    function FailureListingDialogController($scope, $mdDialog, listingData, tryCount) {
        $scope.MAX_TRY_COUNT = 168;
        $scope.listingData = listingData;
        $scope.tryCount = tryCount;

        $scope.hide = function() {
            $mdDialog.hide();
        };
    }

})(angular);
