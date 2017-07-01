/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.util')
        .factory('Principal', PrincipalFactory);

    PrincipalFactory.$inject = [
        '$q',
        'Account'
    ];
    /* @ngInject */
    function PrincipalFactory($q, Account) {
        var _identity;
        var _authenticated = false;

        return {
            authenticate: authenticate,
            hasAnyAuthority: hasAnyAuthority,
            hasAuthority: hasAuthority,
            accountHasGivenAuthority: accountHasGivenAuthority,
            identity: identity,
            isAuthenticated: isAuthenticated,
            isIdentityResolved: isIdentityResolved
        };

        ////////////////

        function authenticate(identity) {
            _identity = identity;
            _authenticated = identity !== null;
        }

        function hasAnyAuthority(authorities) {
            var temp = [];
            if (!angular.isArray(authorities)) {
                temp.push(authorities);
            } else {
                temp = authorities;
            }
            if (!_authenticated || !_identity || !_identity.authorities) {
                return false;
            }

            for (var i = 0; i < temp.length; i++) {
                if (_identity.authorities.indexOf(temp[i]) !== -1) {
                    return true;
                }
            }

            return false;
        }

        function hasAuthority(authority) {
            if (!_authenticated) {
                return $q.when(false);
            }

            return this.identity().then(onSuccess, onFailed);

            ////////////////////////////////////////////////////

            function onSuccess(_id) {
                return _id.authorities && _id.authorities.indexOf(authority) !== -1;
            }

            function onFailed() {
                return false;
            }
        }

        function accountHasGivenAuthority(account, givenAuthority) {
            if (account && account.authorities && account.authorities.length > 0) {
                return account.authorities.filter(filter).length > 0;
            }

            ///////////////////////////////////////////////////

            function filter(authority) {
                return authority === givenAuthority;
            }
        }

        function identity(force) {
            var deferred = $q.defer();

            if (force === true) {
                _identity = undefined;
            }

            // check and see if we have retrieved the identity data from the server.
            // if we have, reuse it by immediately resolving
            if (angular.isDefined(_identity)) {
                deferred.resolve(_identity);

                return deferred.promise;
            }

            // retrieve the identity data from the server, update the identity object, and then resolve.
            Account.get().$promise
                .then(getAccountThen)
                .catch(getAccountCatch);

            return deferred.promise;

            /////////////////////////////////////////////////////

            function getAccountThen(account) {
                _identity = account.data;
                _authenticated = true;
                deferred.resolve(_identity);
            }

            function getAccountCatch() {
                _identity = null;
                _authenticated = false;
                deferred.resolve(_identity);
            }
        }

        function isAuthenticated() {
            return _authenticated;
        }

        function isIdentityResolved() {
            return angular.isDefined(_identity);
        }
    }

})(angular);
