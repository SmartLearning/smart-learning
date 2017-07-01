/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .controller('UserListController', UserListController);

    UserListController.$inject = [
        '$state',
        'Principal',
        'User',
        'ResponseUtil',
        'Language',
        'AccountConstants'
    ];
    /* @ngInject */
    function UserListController($state, Principal, User, ResponseUtil, Language, AccountConstants) {
        var vm = this;

        vm.setActive = setActive;
        vm.clear = clear;
        vm.loadPage = loadPage;
        vm.loadAll = loadAll;
        vm.onPageChange = onPageChange;
        vm.onReorder = onReorder;
        vm.onSelectRow = onSelectRow;
        vm.authorities = AccountConstants.roles;
        vm.data = [];
        vm.pagination = {
            page: 1,
            size: 10,
            sort: ['timestamp,desc'],
            options: [
                10,
                25,
                50,
                100
            ]
        };
        vm.headers = [
            {
                text: 'user.username.title',
                field: 'username'
            },
            {
                text: 'user.email.title',
                field: 'email'
            },
            {
                text: '',
                cellTemplateUrl: 'app/admin/user/list/cells/ActivateCellTemplateView.html',
                setActive: setActive
            },
            {
                text: 'user.language.title',
                field: 'langKey'
            },
            {
                text: 'user.authorities.title',
                cellTemplateUrl: 'app/admin/user/list/cells/AuthorityCellTemplateView.html'
            },
            {
                text: 'user.created_at.title',
                field: 'createdAtTouched'
            },
            {
                text: 'user.modified_by.title',
                field: 'modifiedBy'
            },
            {
                text: 'user.modified_at.title',
                field: 'modifiedAtTouched'
            }
        ];

        activate();

        ////////////////

        function activate() {
            vm.loadAll();

            Language.getAll().then(onLanguageSuccess);
            Principal.identity().then(onIdentity);

            ///////////////////////////////

            function onLanguageSuccess(result) {
                vm.languages = result;
            }

            function onIdentity(account) {
                vm.currentAccount = account;
            }

        }

        function onPageChange(page, size) {
            vm.pagination.page = page || vm.pagination.page;
            vm.pagination.size = size || vm.pagination.size;
            vm.loadAll();
        }

        function onReorder(order) {
            vm.pagination.sort = ResponseUtil.buildSort(order);
            vm.loadAll();
        }

        function loadAll() {
            User.query(
                {
                    page: vm.pagination.page - 1,
                    size: vm.pagination.size,
                    sort: vm.pagination.sort
                }, onSuccess
            );

            ////////////////////////////////

            function onSuccess(result, headers) {
                vm.data = result;
                vm.links = ResponseUtil.parseLink(headers('link'));
                vm.totalItems = headers('X-Total-Count');
            }
        }

        function loadPage(page) {
            vm.page = page;
            vm.loadAll();
        }

        function setActive(event, user, isActivated) {
            event.preventDefault();
            event.stopPropagation();

            user.activated = isActivated;
            User.update(user, onUpdateSuccess);

            /////////////////////

            function onUpdateSuccess() {
                vm.loadAll();
                vm.clear();
            }
        }

        function onSelectRow(model) {
            $state.go('user.detail', {id: model.id}, {reload: true});
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
        }
    }

})(angular);
