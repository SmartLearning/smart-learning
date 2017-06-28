/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .constant(
            'TableConstants', {
                editType: {
                    NUMERIC: 'NUMERIC',
                    BOOLEAN: 'BOOLEAN',
                    TEXT: 'TEXT',
                    ENUM: 'ENUM',
                    CUSTOM: 'CUSTOM'
                }
            }
        );

})(angular);
