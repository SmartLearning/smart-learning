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

        $mdThemingProvider.definePalette(
            'smart-red',
            $mdThemingProvider.extendPalette(
                'red',
                {
                    '700': 'f90000'
                }
            )
        );

        $mdThemingProvider.definePalette(
            'smart-orange',
            $mdThemingProvider.extendPalette(
                'orange',
                {
                    '50': '000000',
                    '100': 'ffffff',
                    '700': 'f28b00',
                    '800': 'ff8600',
                    '900': 'ff8600',
                    'A700': 'e67a02'
                }
            )
        );

        $mdThemingProvider.definePalette(
            'smart-light-green',
            $mdThemingProvider.extendPalette(
                'light-green',
                {
                    '400': '9cc435',
                    '900': '009900'
                }
            )
        );

        $mdThemingProvider.definePalette(
            'smart-background',
            $mdThemingProvider.extendPalette(
                'grey',
                {
                    '50': 'e5e5e5'
                }
            )
        );

        $mdThemingProvider.definePalette(
            'smart-blue-grey',
            $mdThemingProvider.extendPalette(
                'blue-grey',
                {
                    'A100': '92979A'
                }
            )
        );

        $mdThemingProvider.definePalette(
            'smart-yellow',
            $mdThemingProvider.extendPalette(
                'yellow',
                {
                    'A200': 'FFFF00'
                }
            )
        );

        $mdThemingProvider.theme('default')
            .backgroundPalette('smart-background')
            .primaryPalette(
                'smart-orange', {
                    'default': '900',
                    'hue-1': '500',
                    'hue-2': 'A700',
                    'hue-3': '900'
                }
            )
            .accentPalette('blue-grey')
            .warnPalette('smart-red');

        $mdThemingProvider.theme('navigation')
            .backgroundPalette(
                'smart-background',
                {
                    'default': 'A100',
                    'hue-1': '700',
                    'hue-2': '800',
                    'hue-3': '900'
                }
            )
            .accentPalette('smart-blue-grey');

        $mdThemingProvider.theme('alert')
            .primaryPalette(
                'smart-blue-grey', {
                    'default': '700',
                    'hue-1': '500',
                    'hue-2': '600',
                    'hue-3': '700'
                }
            )
            .accentPalette(
                'smart-light-green', {
                    'default': '400', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '700', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '900', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': '400' // use shade A100 for the <code>md-hue-3</code> class
                }
            )
            .warnPalette(
                'smart-red', {
                    'default': '700',
                    'hue-1': '500',
                    'hue-2': '600',
                    'hue-3': '700'
                }
            );

        $mdThemingProvider.theme('customHeaderTheme')
            .accentPalette('smart-yellow');


        var customBackground = {
            '50': '#ffffff',
            '100': '#ffffff',
            '200': '#ffffff',
            '300': '#ffffff',
            '400': '#ffffff',
            '500': '#fff',
            '600': '#f2f2f2',
            '700': '#e6e6e6',
            '800': '#d9d9d9',
            '900': '#cccccc',
            'A100': '#ffffff',
            'A200': '#ffffff',
            'A400': '#ffffff',
            'A700': '#bfbfbf'
        };
        $mdThemingProvider
            .definePalette(
                'customBackground',
                customBackground
            );

        $mdThemingProvider.theme('category-list')
            .backgroundPalette('customBackground');

        ////////////////////////////////////////////////////

        function onImageError(image) {
            var element = angular.element(image.$elem);
            element.attr('src', 'content/images/no_image_icon_en.gif');
        }
    }
})(angular);
