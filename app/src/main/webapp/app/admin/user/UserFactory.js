/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .factory('User', UserFactory);

    UserFactory.$inject = [
        '$resource',
        '$http'
    ];
    /* @ngInject */
    function UserFactory($resource, $http) {
        var url = 'api/users';
        var resource = $resource(
            url + '/:id',
            {},
            {
                'query': {
                    method: 'GET',
                    isArray: true
                },
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        if (!data) {
                            return data;
                        }
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                'save': {method: 'POST'},
                'update': {method: 'PUT'},
                'delete': {method: 'DELETE'}
            }
        );

        resource.searchMerchant = searchMerchant;
        resource.getByIds = getByIds;
        resource.getAllCta = getAllCta;

        return resource;

        //////////////////////

        function searchMerchant(query,pageable) {
            return $http.post(url + '/merchants/', query,
                {
                    params: pageable
                }).then(
                function (result) {
                    return result;
                }
            )
        }

        function getByIds(ids) {
            return $http.post(url + '/find-by-ids', ids).then(
                function (result) {
                    return result.data;
                }
            )
        }

        function getAllCta() {
            return $http.get(url + '/find-all-cta').then(
                function (result) {
                    return result.data;
                }
            )
        }
    }

})(angular);
