/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .controller('UserListController', UserListController);

    UserListController.$inject = [
        'Principal',
        'User',
        'ParseLinks',
        'PaginationConstants',
        'Language',
        'AccountConstants'
    ];
    /* @ngInject */
    function UserListController(Principal, User, ParseLinks,
                                PaginationConstants, Language, AccountConstants) {
        var vm = this;

        vm.authorities = AccountConstants.roles;
        vm.clear = clear;
        vm.currentAccount = null;
        vm.languages = null;
        vm.links = null;
        vm.loadAll = loadAll;
        vm.loadPage = loadPage;
        vm.page = 1;
        vm.setActive = setActive;
        vm.totalItems = null;
        vm.users = [];

        activate();

        ////////////////

        function activate() {
            vm.loadAll();

            Language.getAll().then(
                function (languages) {
                    vm.languages = languages;
                }
            );

            Principal.identity().then(
                function (account) {
                    vm.currentAccount = account;
                }
            );
        }

        function loadAll() {
            User.query(
                {
                    page: vm.page - 1,
                    size: PaginationConstants.ITEMS_PER_PAGE
                }, function (result, headers) {
                    vm.links = ParseLinks.parse(headers('link'));
                    vm.totalItems = headers('X-Total-Count');
                    vm.users = result;
                }
            );
        }

        function loadPage(page) {
            vm.page = page;
            vm.loadAll();
        }

        function setActive(user, isActivated) {
            user.activated = isActivated;
            User.update(
                user, function () {
                    vm.loadAll();
                    vm.clear();
                }
            );
        }

        function clear() {
            vm.user = {
                id: null,
                login: null,
                firstName: null,
                lastName: null,
                email: null,
                activated: null,
                langKey: null,
                createdBy: null,
                createdDate: null,
                lastModifiedBy: null,
                lastModifiedDate: null,
                resetDate: null,
                resetKey: null,
                authorities: null
            };
            vm.editForm.$setPristine();
            vm.editForm.$setUntouched();
        }
    }

})(angular);
