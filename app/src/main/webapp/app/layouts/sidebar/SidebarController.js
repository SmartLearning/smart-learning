/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.layout')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = [
        '$state',
        'routerHelper',
        'MenuGroups'
    ];
    /* @ngInject */
    function SidebarController($state, routerHelper, MenuGroups) {
        var vm = this;

        var states = routerHelper.getStates();
        vm.isCurrent = isCurrent;

        activate();

        /////////////////////

        function activate() {
            refreshNavRoutes();
        }

        function refreshNavRoutes() {
            var routes = states.filter(filter)
                .sort(sort);

            vm.routes = [];

            var groups = {};
            routes.forEach(
                function (item) {
                    if (!item.settings) {
                        return true;
                    }
                    var group = item.settings.group = item.settings.group || angular.extend({}, MenuGroups.ROOT);

                    if (!angular.isObject(group)) {
                        group = {
                            name: group
                        };
                    }

                    if (angular.isUndefined(groups[group.name])) {
                        groups[group.name] = {
                            items: [],
                            icon: group.icon
                        };
                    }

                    groups[group.name].items.push(
                        angular.extend(
                            {},
                            item.settings,
                            {
                                name: item.name
                            }
                        )
                    );
                }
            );

            var i = 1;
            for (var index in groups) {
                if (groups.hasOwnProperty(index)) {
                    var order = (index === 'root') ? 0 : i++;
                    var text = 'layout.sidebar.groups.' + index;
                    if (index.indexOf('plugin.') > -1) {
                        text = index.replace('plugin.', '') + '.title';
                    }
                    vm.routes[order] = angular.extend(
                        {},
                        {
                            name: index,
                            text: text
                        },
                        groups[index]
                    );
                }
            }

            function filter(r) {
                return !r.abstract &&
                    (
                        !r.settings || r.settings.showOnMenu !== false
                    );
            }

            function sort(r1, r2) {
                if (!r1.settings || !r2.settings) {
                    return 0;
                }
                return r1.settings.order - r2.settings.order;
            }
        }

        function isCurrent(route) {
            if (!route.title || !$state.current || !$state.current.title) {
                return '';
            }
            var menuName = route.title;
            return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    }
})(angular);
