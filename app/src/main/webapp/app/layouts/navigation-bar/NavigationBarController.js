/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.layout')
        .controller('NavigationBarController', NavigationBarController);

    NavigationBarController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$window',
        '$timeout',
        '$q',
        '$interval',
        'Auth',
        'Principal',
        'ENV',
        'User',
        'routerHelper',
        'MenuIcons',
        'SidenavUtil',
        'AccountConstants',
        'Notification'
    ];
    /* @ngInject */
    function NavigationBarController($rootScope, $scope, $state, $window, $timeout, $q, $interval, Auth, Principal, ENV, User, routerHelper, MenuIcons, SidenavUtil, AccountConstants, Notification) {
        var vm = this;
        var removeMerchantChangedListenerFn;
        var CHECK_NOTIFICATION_COUNT_INTERVAL = 60 * 1000;

        vm.login = login;
        vm.home = home;
        vm.headerClick = headerClick;
        vm.state = state;
        vm.logout = logout;
        vm.isCurrentPage = isCurrentPage;
        vm.searchMerchant = searchMerchant;
        vm.selectMerchant = selectMerchant;
        vm.signUp = signUp;
        vm.clearMerchant = clearMerchant;
        vm.openSideNavMenu = openSideNavMenu;
        vm.checkForFunction = checkForFunction;
        vm.nextPage = nextPage;

        vm.query = null;
        vm.busy = false;
        vm.clickedSearch = false;
        vm.pagination = {
            page: -1,
            size: 5
        };

        vm.account = {};
        vm.navCollapsed = true;
        vm.inProduction = ENV === 'prod';
        vm.isAuthenticated = Principal.isAuthenticated;
        vm.merchants = [];
        vm.isCta = false;
        vm.isIntegrator = false;
        vm.myProductsTabState = 'product.list';

        activate();

        ////////////////

        function activate() {
            Principal.identity().then(onAccountSuccess);
            Principal.hasAuthority(AccountConstants.roles.CTA).then(onCheckCTA);
            Principal.hasAuthority(AccountConstants.roles.INTEGRATOR).then(onCheckIntegrator);

            fetchAndSelectMerchant(Principal.getMerchant());
            refreshNavRoutes();

            listenToChangeMerchant();

            //////////////////////////////////

            function onAccountSuccess(account) {
                vm.account = account;
            }

            function onCheckCTA(isCta) {
                findTaskNotificationCount(isCta)();
                $interval(findTaskNotificationCount(isCta), CHECK_NOTIFICATION_COUNT_INTERVAL);
                vm.isCta = isCta;
            }

            function onCheckIntegrator(isIntegrator) {
                vm.isIntegrator = isIntegrator;
            }
        }


        function nextPage() {
            if (!vm.clickedSearch || vm.busy) {
                return;
            }

            vm.busy = true;

            User.searchMerchant(vm.query, {
                page: ++vm.pagination.page,
                size: vm.pagination.size
            }).then(function (item) {
                    vm.busy = (vm.pagination.size * (vm.pagination.page + 1)) >= item.headers('X-Total-Count');
                    vm.merchants = vm.merchants.concat(item.data);
                }
            ).catch(
                function (error) {
                    console.error(error);
                }
            )

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

        function fetchAndSelectMerchant(merchant) {
            if (!merchant) {
                return;
            }
            User.get(
                {
                    id: merchant
                },
                function (user) {
                    vm.selectedMerchant = user;
                }
            );
        }

        function login() {
            $window.location.replace('/hb-login');
        }

        function logout() {
            Auth.logout();
            $window.location.replace('/local-logout');
        }

        function clearMerchant() {
            selectMerchant(null);
        }

        function home() {
            state('home', true);
        }

        function headerClick(group) {
            if (angular.isArray(group.items) && group.items.length > 0) {
                navigateToTab(group);
            } else if (group.state) {
                state(group.state);
            }
        }

        function navigateToTab(group) {
            if (group.state === 'product') {
                state(vm.myProductsTabState);
            }
            else {
                state(group.items[0].state);
            }
        }

        function state(state, reload) {
            $state.go(state, {}, {reload: reload});
        }

        function isCurrentPage(state) {
            return $state.includes(state);
        }

        function searchMerchant(query) {
            vm.query = query;
            vm.clickedSearch = true;

            if (vm.previousMerchantSearch) {
                $timeout.cancel(vm.previousMerchantSearch);
            }

            var defer = $q.defer();

            vm.previousMerchantSearch = $timeout(onSearch, 500);

            return defer.promise;

            ///////////////////////////////////

            function onSearch() {
                vm.merchants = [];
                if (!query) {
                    defer.resolve([]);
                    return;
                }
                User.searchMerchant(query, vm.pagination).then(onUserSuccess, defer.reject);

                ///////////////////////////////////

                function onUserSuccess(response) {
                    vm.merchants = response.data;
                    defer.resolve(response.data);
                }
            }
        }

        function selectMerchant(merchant) {
            vm.selectedMerchant = merchant;
            Principal.setMerchant(merchant && merchant.id);

            $rootScope.$broadcast('merchantChanged');
        }

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

        function listenToChangeMerchant() {
            $scope.$on(
                'merchantSelected', function (event, merchant) {
                    if (merchant) {
                        Principal.setMerchant(merchant && merchant.id);
                        vm.selectedMerchant = merchant;
                    }
                }
            );

            if (!removeMerchantChangedListenerFn) {
                removeMerchantChangedListenerFn = $scope.$on(
                    "merchantChanged", function () {
                        location.reload(true);
                    }
                );
                $scope.$on(
                    '$destroy', function () {
                        removeMerchantChangedListenerFn();
                    }
                );
            }
        }

        function refreshNavRoutes() {
            var states = routerHelper.getStates();
            var routes = states.filter(filter);

            vm.menus = [];

            var groups = {};
            routes.forEach(
                function (item) {
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
                }
            );

            var app = groups.app;

            if (app) {
                angular.forEach(
                    app.items,
                    function (item) {
                        checkAuthorities(item);
                    }
                );

                delete groups.app;
            }

            var index = 0;
            angular.forEach(
                groups,
                function (item, key) {
                    item.order = item.order || index++;
                    item.state = key;
                    angular.forEach(
                        item.items,
                        function (child) {
                            angular.extend(item.authorities, child.authorities);
                        }
                    );
                    checkAuthorities(item);
                }
            );

            groups = null;
            $timeout(
                function () {
                    vm.menus.sort(sort);
                    angular.forEach(
                        vm.menus, function (child) {
                            child.items.sort(sort);
                        }
                    )
                }, 1000
            );

            //////////////////////////////////

            function filter(r) {
                return !r.abstract && angular.isObject(r.menu) && !checkForFunction(r.hidden)
            }

            function sort(r1, r2) {
                if (!r1.order || !r2.order) {
                    return 0;
                }
                return r1.order - r2.order;
            }

            function checkAuthorities(item) {
                if (Principal.hasAnyAuthority(item.denyAuthorities)) {
                    return;
                }
                if (isAuthorized(item.authorities)) {
                    var menus = [];
                    angular.forEach(
                        item.items, function (menu) {
                            if (isAuthorized(menu.authorities)) {
                                menus.push(menu);
                            }
                        }
                    );
                    item.items = menus;
                    vm.menus.push(item);
                }

                /////////////////////////////////////

                function isAuthorized(authorities) {
                    return (angular.isArray(authorities) && authorities.length === 0) || Principal.hasAnyAuthority(authorities);
                }
            }
        }

        function signUp() {
            $state.transitionTo('sign-up');
        }

        function checkForFunction(disabled) {
            if (angular.isFunction(disabled)) {
                return disabled();
            }

            return disabled;
        }

        function findTaskNotificationCount(isCTA) {
            return function () {
                if (Principal.isNotImpersonated()) {
                    return;
                }

                Notification.findTopByType({type: 'TASK_COUNT'}, onNotificationGet);

                ///////////////////////////////////////

                function onNotificationGet(response) {
                    if (response.data === undefined) {
                        return;
                    }
                    for (var i = 0; i < vm.menus.length; i++) {
                        var item = vm.menus[i];
                        if (item.state === "tasks") {
                            var count = 0;
                            if (isCTA) {
                                count = response.data.ROLE_CTA;
                            } else {
                                count = response.data.ROLE_MERCHANT;
                            }

                            item.count = count;
                            break;
                        }
                    }
                }
            }
        }


    }

})(angular);
