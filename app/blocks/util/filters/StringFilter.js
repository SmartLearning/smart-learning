/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('format', FormatFilter)
        .filter('capitalize', CapitalizeFilter)
        .filter('characters', CharactersFilter)
        .filter('words', WordsFilter)
        .filter('split', SplitFilter)
        .filter('yesNo', YesNoFilter)
        .filter('join', JoinFilter)
        .filter('normalizeSlugUrl', NormalizeSlugUrlFilter)
        .filter('prettify', PrettifyFilter);

    FormatFilter.$inject = [];
    /* @ngInject */
    function FormatFilter() {
        return formatFilter;

        ////////////////

        function formatFilter(input) {
            // The string containing the format items (e.g. "{0}")
            // will and always has to be the first argument.
            var theString = input;

            // start with the second argument (i = 1)
            for (var i = 1; i < arguments.length; i++) {
                // "gm" = RegEx options for Global search (more than one instance)
                // and for Multiline search
                var regEx = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                theString = theString.replace(regEx, arguments[i]);
            }

            return theString;
        }
    }

    CapitalizeFilter.$inject = [];
    /* @ngInject */
    function CapitalizeFilter() {
        return capitalizeFilter;

        ////////////////

        function capitalizeFilter(input) {
            return (input + '').replace(
                /^([a-z])|\s+([a-z])/g, function ($1) {
                    return $1.toUpperCase();
                }
            );
        }
    }

    CharactersFilter.$inject = [];
    /* @ngInject */
    function CharactersFilter() {
        return charactersFilter;

        ////////////////////

        function charactersFilter(input, chars, breakOnWord) {
            if (isNaN(chars)) {
                return input;
            }
            if (chars <= 0) {
                return '';
            }
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    // Get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                } else {
                    while (input.charAt(input.length - 1) === ' ') {
                        input = input.substr(0, input.length - 1);
                    }
                }
                return input + '...';
            }
            return input;
        }
    }

    WordsFilter.$inject = [];
    /* @ngInject */
    function WordsFilter() {
        return wordsFilter;

        /////////////////////

        function wordsFilter(input, words) {
            if (isNaN(words)) {
                return input;
            }
            if (words <= 0) {
                return '';
            }
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }

            return input;
        }
    }

    SplitFilter.$inject = [];
    /* @ngInject */
    function SplitFilter() {
        return splitFilter;

        ////////////////

        function splitFilter(input, separator, splitIndex) {
            var split = input.split(separator);
            if (!splitIndex) {
                return split;
            }
            return split.length <= splitIndex ? '' : split[splitIndex];
        }
    }

    YesNoFilter.$inject = ['$filter'];
    /* @ngInject */
    function YesNoFilter($filter) {
        return yesNoFilter;

        ////////////////

        function yesNoFilter(input, trueResponse, falseResponse) {
            if (input) {
                return $filter("translate")(trueResponse || "global.form.yes")
            } else {
                return $filter("translate")(falseResponse || "global.form.no")
            }
        }
    }

    JoinFilter.$inject = [];
    /* @ngInject */
    function JoinFilter() {
        return joinFilter;

        ////////////////

        function joinFilter(input, separator) {
            if (angular.isArray(input)) {
                return input.join(separator);
            }

            return '';
        }
    }

    NormalizeSlugUrlFilter.$inject = ['StringUtil'];
    /* @ngInject */
    function NormalizeSlugUrlFilter(StringUtil) {
        return StringUtil.normalizeSlugUrl;
    }

    PrettifyFilter.$inject = [];
    /* @ngInject */
    function PrettifyFilter() {
        return syntaxHighlight;

        //////////////////////////////////////////////

        function syntaxHighlight(json) {
            if (!json) {
                return '';
            }
            if (!angular.isString(json)) {
                json = angular.toJson(json, true);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?),?/g, onMatch);

            /////////////////////////////////////////////////

            function onMatch(match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }

                return '<span class="' + cls + '">' + match + '</span>';
            }
        }
    }
})(angular);
