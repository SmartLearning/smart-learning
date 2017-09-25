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
        'Principal',
        'DEBUG_INFO_ENABLED',
        'routerHelper',
        'MenuIcons',
        'SidenavUtil'
    ];
    /* @ngInject */
    function NavigationBarController($state, $timeout, Principal, DEBUG_INFO_ENABLED, routerHelper, MenuIcons, SidenavUtil) {
        var vm = this;

        vm.login = login;
        vm.home = home;
        vm.headerClick = headerClick;
        vm.state = state;
        vm.logout = logout;
        vm.settings = settings;
        vm.isCurrentPage = isCurrentPage;
        vm.register = register;
        vm.openSideNavMenu = openSideNavMenu;
        vm.checkForFunction = checkForFunction;

        vm.pagination = {
            page: -1,
            size: 5
        };

        vm.account = {};
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
                var menus = states.filter(filter);
                vm.menus = [];
                var groups = {};

                angular.forEach(menus, iterateOnRoutes);

                var app = groups.app;
                if (app) {
                    angular.forEach(app.items, checkAuthorities);

                    delete groups.app;
                }

                angular.forEach(groups, iterateOnGroups);

                groups = null;
                $timeout(onLoad, 1000);

                //////////////////////////////////////////////////

                function onLoad() {
                    vm.menus.sort(sort);
                    angular.forEach(vm.menus, onChildIterate);

                    //////////////////////////////////////////////////////

                    function onChildIterate(child) {
                        child.items.sort(sort);
                    }

                    function sort(r1, r2) {
                        if (!angular.isNumber(r1.order) || !angular.isNumber(r2.order)) {
                            return 0;
                        }
                        return r1.order - r2.order;
                    }
                }

                function iterateOnGroups(item, key) {
                    item.state = key;
                    item.text = 'global.menu.' + key;
                    if (item.items.length > 0) {
                        item.text += '.title';
                    }
                    angular.forEach(item.items, iterateOnChild);
                    checkAuthorities(item);

                    //////////////////////

                    function iterateOnChild(child) {
                        item.authorities = Array.from(new Set([].concat(item.authorities).concat(child.authorities)));
                    }
                }

                function iterateOnRoutes(item) {
                    var prototype = Object.getPrototypeOf(item.data);
                    var data = angular.merge({}, prototype, item.data);
                    data.authorities = item.data.authorities || prototype.authorities;
                    data.writeAuthorities = item.data.writeAuthorities || prototype.writeAuthorities;
                    data.denyAuthorities = item.data.denyAuthorities || prototype.denyAuthorities;
                    item.data = data;

                    var parent = getParentName(item);

                    if (angular.isUndefined(groups[parent])) {
                        groups[parent] = {
                            items: [],
                            icon: MenuIcons[parent.toUpperCase()]
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

                    groups[parent].authorities = Array.from(new Set([].concat(groups[parent].authorities).concat(item.data.authorities)));
                    groups[parent].writeAuthorities = Array.from(new Set([].concat(groups[parent].writeAuthorities).concat(item.data.writeAuthorities)));
                    groups[parent].denyAuthorities = Array.from(new Set([].concat(groups[parent].denyAuthorities).concat(item.data.denyAuthorities)));

                    if (angular.isNumber(item.data.menu.groupOrder)) {
                        groups[parent].groupOrder = item.data.menu.groupOrder;
                    }

                    groups[parent].items.push(
                        angular.extend(
                            {},
                            item.data.menu,
                            {
                                state: item.name,
                                disabled: item.data ? item.data.disabled : false,
                                authorities: item.data ? item.data.authorities : [],
                                writeAuthorities: item.data ? item.data.writeAuthorities : [],
                                denyAuthorities: item.data ? item.data.denyAuthorities : []
                            }
                        )
                    );
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
                    return !r.abstract &&
                        angular.isObject(r.data) &&
                        angular.isObject(r.data.menu) &&
                        angular.isString(r.data.menu.text) &&
                        !checkForFunction(r.hidden)
                }
            }
        }

        function getParentName(state) {
            var data = angular.merge({}, Object.getPrototypeOf(state.data), state.data);
            var parent = state.parent;
            if (data && data.menu && data.menu.parent) {
                parent = data.menu.parent;
            }

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

        function register() {
            state('register', true);
        }

        function login() {
            state('login', true);
        }

        function logout() {
            state('logout', true);
        }

        function settings() {
            state('settings', true);
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


        function isCurrentPage(state, parent) {
            if (!state) {
                return false;
            }

            if ($state.current.name === state) {
                return true;
            }

            if ($state.includes(state)) {
                return true;
            }

            if (parent) {
                if ($state.includes(state.split('.')[0])) {
                    return true;
                }

                var parentName = getParentName($state.current);
                return parentName && state.indexOf(parentName) >= 0;
            }

            return getIndicatorState($state.current) === state;

            ////////////////////////////////////////////////////////////

            function getIndicatorState(state) {
                if (state.data && state.data.menu && state.data.menu.indicatorState) {
                    return state.data.menu.indicatorState;
                }

                return null;
            }
        }

        function checkForFunction(disabled) {
            if (angular.isFunction(disabled)) {
                return disabled();
            }

            return disabled;
        }
    }

})(angular);
