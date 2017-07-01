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
        'ParseLinksUtil',
        'Language',
        'AccountConstants'
    ];
    /* @ngInject */
    function UserListController(Principal, User, ParseLinksUtil, Language, AccountConstants) {
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

            Language.getAll().then(onLanguage);
            Principal.identity().then(onAccount);

            ////////////////////////////////////////////////////

            function onLanguage(languages) {
                vm.languages = languages;
            }

            function onAccount(account) {
                vm.currentAccount = account;
            }
        }

        function loadAll() {
            User.query({page: vm.page - 1, size: 20}, onSuccess);

            ////////////////////////////////////////////////////////

            function onSuccess(result, headers) {
                vm.links = ParseLinksUtil.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.users = result;
            }
        }

        function loadPage(page) {
            vm.page = page;
            vm.loadAll();
        }

        function setActive(user, isActivated) {
            user.activated = isActivated;
            User.update(user, onSuccess);

            ///////////////////////////////////////////////////

            function onSuccess() {
                vm.loadAll();
                vm.clear();
            }
        }

        function clear() {
            vm.user = {};
            vm.editForm.$setPristine();
            vm.editForm.$setUntouched();
        }
    }

})(angular);
