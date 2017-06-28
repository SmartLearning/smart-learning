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
                        transformResponse: function (data) {
                            return DateUtils.fromServer(data);
                        }
                    },
                    get: {
                        method: 'GET',
                        transformResponse: function (data) {
                            return DateUtils.fromServer(data);
                        }
                    },
                    update: {
                        method: 'PUT',
                        transformRequest: function (data) {
                            return DateUtils.toServer(data);
                        },
                        transformResponse: function (data) {
                            return DateUtils.fromServer(data);
                        }
                    },
                    save: {
                        method: 'POST',
                        transformRequest: function (data) {
                            return DateUtils.toServer(data);
                        },
                        transformResponse: function (data) {
                            return DateUtils.fromServer(data);
                        }
                    },
                    delete: {method: 'DELETE'}
                }
            );
        }
    }

})(angular);
