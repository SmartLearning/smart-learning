/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('smartApp')
        .config(AppConfig);

    AppConfig.$inject = [
        '$mdThemingProvider',
        'timeAgoSettings',
        'lazyImgConfigProvider'
    ];
    /* @ngInject */
    function AppConfig($mdThemingProvider, timeAgoSettings, lazyImgConfigProvider) {

        lazyImgConfigProvider.setOptions({onError: onImageError});

        timeAgoSettings.strings['en'] = timeAgoSettings.strings['en_US'];

        // $mdIconProvider.defaultFontSet('fa'); // using awesome fonts
        $mdThemingProvider.alwaysWatchTheme(true);

        ////////////////////////////////////////////////////

        function onImageError(image) {
            var element = angular.element(image.$elem);
            element.attr('src', 'content/images/no_image_icon_en.gif');
        }
    }
})(angular);
