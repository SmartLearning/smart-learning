/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.layout')
        .controller('NavigationBarController', NavigationBarController);

    NavigationBarController.$inject = [
        '$state',
        '$timeout',
        'Auth',
        'Principal',
        'DEBUG_INFO_ENABLED',
        'routerHelper',
        'MenuIcons',
        'SidenavUtil'
    ];
    /* @ngInject */
    function NavigationBarController($state, $timeout, Auth, Principal, DEBUG_INFO_ENABLED, routerHelper, MenuIcons, SidenavUtil) {
        var vm = this;

        vm.login = login;
        vm.home = home;
        vm.headerClick = headerClick;
        vm.state = state;
        vm.logout = logout;
        vm.isCurrentPage = isCurrentPage;
        vm.register = register;
        vm.openSideNavMenu = openSideNavMenu;
        vm.checkForFunction = checkForFunction;

        vm.query = null;
        vm.busy = false;
        vm.pagination = {
            page: -1,
            size: 5
        };

        vm.account = {};
        vm.navCollapsed = true;
        vm.inProduction = !DEBUG_INFO_ENABLED;
        vm.isAuthenticated = Principal.isAuthenticated;

        activate();

        ////////////////

        function activate() {
            Principal.identity().then(onAccountSuccess);

            refreshNavRoutes();

            //////////////////////////////////

            function onAccountSuccess(account) {
                vm.account = account;
            }

            function refreshNavRoutes() {
                var states = routerHelper.getStates();
                var routes = states.filter(filter);

                vm.menus = [];

                var groups = {};
                routes.forEach(onIterate);

                var app = groups.app;

                if (app) {
                    angular.forEach(app.items, checkAuthorities);

                    delete groups.app;
                }

                var index = 0;
                angular.forEach(groups, onGroup);

                groups = null;
                $timeout(timeout, 1000);

                //////////////////////////////////////////////////

                function timeout() {
                    vm.menus.sort(sort);
                    angular.forEach(vm.menus, onChildIterate);

                    //////////////////////////////////////////////////////

                    function onChildIterate(child) {
                        child.items.sort(sort);
                    }

                    function sort(r1, r2) {
                        if (!r1.order || !r2.order) {
                            return 0;
                        }
                        return r1.order - r2.order;
                    }
                }

                function onGroup(item, key) {
                    item.order = item.order || index++;
                    item.state = key;
                    angular.forEach(item.items, onItem);
                    checkAuthorities(item);

                    /////////////////////////////////////////////////////

                    function onItem(child) {
                        angular.extend(item.authorities, child.authorities);
                    }
                }

                function onIterate(item) {
                    var parent = getParentName(item);

                    if (angular.isUndefined(groups[parent])) {
                        groups[parent] = {
                            items: [],
                            icon: MenuIcons[parent.toUpperCase()],
                            disabled: item.data ? item.data.disabled : false
                        };

                        if (item.data) {
                            if (!groups[parent].authorities) {
                                groups[parent].authorities = [];
                            }
                            if (!groups[parent].denyAuthorities) {
                                groups[parent].denyAuthorities = [];
                            }
                            angular.merge(groups[parent].authorities, item.data.authorities);
                            angular.merge(groups[parent].denyAuthorities, item.data.denyAuthorities);
                        }
                    }

                    groups[parent].items.push(
                        angular.extend(
                            {},
                            item.menu,
                            {
                                authorities: item.data ? item.data.authorities : [],
                                denyAuthorities: item.data ? item.data.denyAuthorities : [],
                                state: item.name,
                                disabled: item.data ? item.data.disabled : false
                            }
                        )
                    );

                    ////////////////////////////////////////////////////

                    function getParentName(state) {
                        var parent = state.menu.parent || state.parent;

                        if (!parent && state.name) {
                            var name = state.name.split(".");
                            if (name.length > 1) {
                                parent = name[name.length - 2];
                            } else {
                                parent = name[0];
                            }
                        }

                        return parent;
                    }
                }

                function checkAuthorities(item) {
                    if (Principal.hasAnyAuthority(item.denyAuthorities)) {
                        return;
                    }

                    if (isAuthorized(item.authorities)) {
                        var menus = [];
                        angular.forEach(item.items, onIterate);
                        item.items = menus;
                        vm.menus.push(item);
                    }

                    /////////////////////////////////////

                    function isAuthorized(authorities) {
                        return (angular.isArray(authorities) && authorities.length === 0) || Principal.hasAnyAuthority(authorities);
                    }

                    function onIterate(menu) {
                        if (isAuthorized(menu.authorities)) {
                            menus.push(menu);
                        }
                    }
                }

                function filter(r) {
                    return !r.abstract && angular.isObject(r.menu) && !checkForFunction(r.hidden)
                }
            }
        }

        function openSideNavMenu() {
            SidenavUtil.show(
                "sidenav-left", {
                    templateUrl: 'app/layouts/navigation-bar/SidenavMenuView.html',
                    controller: 'NavigationBarController',
                    controllerAs: 'vm',
                    direction: 'left'
                }
            );
        }

        function login() {
            state('login', true);
        }

        function logout() {
            Auth.logout();
        }

        function home() {
            state('home', true);
        }

        function headerClick(group) {
            if (angular.isArray(group.items) && group.items.length > 0) {
                state(group.items[0].state);
            } else if (group.state) {
                state(group.state);
            }
        }

        function state(state, reload) {
            $state.go(state, {}, {reload: reload});
        }

        function isCurrentPage(state) {
            return $state.includes(state);
        }

        function register() {
            $state.go('register', true);
        }

        function checkForFunction(disabled) {
            if (angular.isFunction(disabled)) {
                return disabled();
            }

            return disabled;
        }
    }

})(angular);
