
angular.module('firstApplication', ['ngMaterial'])
    .controller('AppCtrl', function ($scope, $mdDialog) {



            $scope.showTableOfContent = function(ev) {
                $mdDialog.show({
                    contentElement: '#tocDialog',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };

        }
    );


