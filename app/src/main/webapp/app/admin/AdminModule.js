/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module(
            'app.admin', [
                'admin.audits',
                'admin.configuration',
                'admin.docs',
                'admin.gateway',
                'admin.health',
                'admin.logs',
                'admin.analyzes',
                'admin.user',
                'app.account',
                'app.layout'
            ]
        );

})(angular);
