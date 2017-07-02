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
            Language.getAll().then(onLang);
            Language.getCurrent().then(changeLanguage);

            /////////////////////////////////////////////////////

            function onLang(languages) {
                vm.languages = languages;
            }
        }

        function changeLanguage(languageKey) {
            $translate.use(languageKey);
            tmhDynamicLocale.set(languageKey);
            timeAgoSettings.overrideLang = languageKey;
        }
    }

})(angular);
