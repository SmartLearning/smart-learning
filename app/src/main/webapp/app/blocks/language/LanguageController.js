/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .controller('LanguageController', LanguageController);

    LanguageController.$inject = [
        '$translate',
        'Language',
        'tmhDynamicLocale',
        'timeAgoSettings'
    ];
    /* @ngInject */
    function LanguageController($translate, Language, tmhDynamicLocale, timeAgoSettings) {
        var vm = this;

        vm.changeLanguage = changeLanguage;
        vm.languages = null;

        activate();

        //////////////////////

        function activate() {
            Language.getAll().then(
                function (languages) {
                    vm.languages = languages;
                }
            );

            Language.getCurrent().then(
                function (lang) {
                    changeLanguage(lang);
                }
            );
        }

        function changeLanguage(languageKey) {
            $translate.use(languageKey);
            tmhDynamicLocale.set(languageKey);
            timeAgoSettings.overrideLang = languageKey;
        }
    }

})(angular);
