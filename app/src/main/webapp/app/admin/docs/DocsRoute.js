/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.docs')
        .run(runDocs);

    runDocs.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runDocs(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'docs',
                config: {
                    url: '/docs',
                    parent: 'admin',
                    data: {
                        pageTitle: 'docs.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/docs/DocsView.html'
                        }
                    },
                    menu: {
                        icon: 'library_books',
                        text: 'global.menu.admin.docs',
                        order: 3
                    }
                }
            }
        ];
    }
})(angular);
