/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.account')
        .factory('Auth', AuthFactory);

    AuthFactory.$inject = [
        '$rootScope',
        '$state',
        '$q',
        '$translate',
        'Principal',
        'AuthServer',
        'Account',
        'Activate'
    ];
    /* @ngInject */
    function AuthFactory($rootScope, $state, $q, $translate, Principal, AuthServer, Account, Activate) {

        return {
            authorize: authorize,
            login: login,
            logout: logout,
            loginWithToken: loginWithToken,
            updateAccount: updateAccount
        };

        ////////////////////////////////////////////////////

        function authorize(force) {
            return Principal.identity(force).then(authThen);

            function authThen() {
                var isAuthenticated = Principal.isAuthenticated();

                if ($rootScope.toState.data && angular.isArray($rootScope.toState.data.denyAuthorities)) {
                    if (Principal.hasAnyAuthority($rootScope.toState.data.denyAuthorities)) {
                        $state.go('home');
                        return;
                    }
                }

                // an authenticated user can't access to login and register pages
                if ((isAuthenticated && $rootScope.toState.parent === 'account') || checkForFunction($rootScope.toState.hidden)) {
                    $state.go('home');
                    return;
                }

                if ($rootScope.toState.data.authorities && $rootScope.toState.data.authorities.length > 0 && !Principal.hasAnyAuthority($rootScope.toState.data.authorities)) {
                    if (isAuthenticated) {
                        // user is signed in but not authorized for desired state
                        // $state.go('accessdenied');
                        $state.go('home');
                    }
                    else {
                        // user is not authenticated. stow the state they wanted before you
                        // send them to the login service, so you can return them when you're done
                        $rootScope.redirected = true;
                        $rootScope.previousStateName = $rootScope.toState;
                        $rootScope.previousStateNameParams = $rootScope.toStateParams;

                        // now, send them to the signin state so they can log in
                        $state.go('accessdenied');
                        // $state.go('login');
                    }
                }
            }

            ////////////////////////////////

            function checkForFunction(hidden) {
                if (angular.isFunction(hidden)) {
                    return hidden();
                }

                return hidden;
            }
        }

        function login(credentials, callback) {
            var cb = callback || angular.noop;
            var deferred = $q.defer();

            AuthServer.login(credentials)
                .then(loginThen)
                .catch(
                    function (err) {
                        this.logout();
                        deferred.reject(err);
                        return cb(err);
                    }.bind(this)
                );

            function loginThen(data) {
                Principal.identity(true).then(onSuccess);
                return cb();

                //////////////////////////////////////////////////

                function onSuccess(account) {
                    // After the login the language will be changed to
                    // the language selected by the user during his registration
                    if (account !== null) {
                        $translate.use(account.langKey).then($translate.refresh);
                    }
                    deferred.resolve(data);
                }
            }

            return deferred.promise;
        }

        function loginWithToken(jwt, rememberMe) {
            return AuthServer.loginWithToken(jwt, rememberMe);
        }

        function logout() {
            AuthServer.logout();
            Principal.authenticate(null);

            // Reset state memory if not redirected
            if (!$rootScope.redirected) {
                $rootScope.previousStateName = undefined;
                $rootScope.previousStateNameParams = undefined;
            }
        }

        function updateAccount(account, callback) {
            var cb = callback || angular.noop;

            return Account.save(
                account,
                function () {
                    return cb(account);
                },
                function (err) {
                    return cb(err);
                }.bind(this)
            ).$promise;
        }
    }

})(angular);
