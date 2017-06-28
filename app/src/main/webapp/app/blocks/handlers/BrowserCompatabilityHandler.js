(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('BrowserCompatabilityHandler', BrowserCompatabilityHandler);

    BrowserCompatabilityHandler.$inject = [
        'Browser',
        'Alert'
    ];
    /* @ngInject */
    function BrowserCompatabilityHandler(Browser, Alert) {
        this.check = check;

        ////////////////

        function check() {
            if (!Browser.isSupported()) {
                Alert.error('global.browsehappy', null, 10000, true);
            }
        }

    }

})(angular);
