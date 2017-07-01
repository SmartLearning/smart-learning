/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('CrudUtils', CrudUtilsService);

    CrudUtilsService.$inject = ['DateUtils'];
    /* @ngInject */
    function CrudUtilsService(DateUtils) {
        this.getAll = getAll;
        this.transformResponse = transformResponse;
        this.transformRequest = transformRequest;

        /////////////////////////////////////

        function transformResponse(data) {
            return DateUtils.fromServer(data);
        }

        function transformRequest(data) {
            return DateUtils.toServer(data);
        }

        function getAll() {
            return angular.extend(
                {}, {
                    query: {
                        method: 'GET',
                        isArray: true,
                        transformResponse: DateUtils.fromServer
                    },
                    get: {
                        method: 'GET',
                        transformResponse: DateUtils.fromServer
                    },
                    update: {
                        method: 'PUT',
                        transformRequest: DateUtils.toServer,
                        transformResponse: DateUtils.fromServer
                    },
                    save: {
                        method: 'POST',
                        transformRequest: DateUtils.toServer,
                        transformResponse: DateUtils.fromServer
                    },
                    delete: {method: 'DELETE'}
                }
            );
        }
    }

})(angular);
