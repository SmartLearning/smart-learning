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
        'DateUtils'
    ];
    /* @ngInject */
    function UserFactory($resource, DateUtils) {
        var url = 'api/users';
        return $resource(
            url + '/:id',
            {},
            {
                'search': {
                    method: 'POST',
                    url: url + '/search',
                    isArray: true
                },
                'query': {
                    method: 'GET',
                    isArray: true,
                    transformResponse: function (data) {
                        return DateUtils.fromServer(data, [
                            'createdAt',
                            'modifiedAt'
                        ]);
                    }
                },
                'idLoginMaps': {
                    method: 'GET',
                    url: url + '/id-login-maps/:ids',
                    transformResponse: function (data) {
                        return DateUtils.fromServer(data, [
                            'createdAt',
                            'modifiedAt'
                        ]);
                    }
                },
                'get': {
                    method: 'GET',
                    transformResponse: DateUtils.fromServer
                },
                'save': {
                    method: 'POST',
                    transformRequest: function (data) {
                        return DateUtils.toServer(data, [
                            'createdAt',
                            'modifiedAt'
                        ]);
                    }
                },
                'update': {
                    method: 'PUT',
                    transformRequest: function (data) {
                        return DateUtils.toServer(data, [
                            'createdAt',
                            'modifiedAt'
                        ]);
                    }
                },
                'delete': {method: 'DELETE'}
            }
        );
    }
})(angular);
