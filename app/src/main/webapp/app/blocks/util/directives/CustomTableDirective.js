/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('mdCustomTable', mdCustomTable);

    mdCustomTable.$inject = [];
    /* @ngInject */
    function mdCustomTable() {
        return {
            bindToController: true,
            controller: CustomTableController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: 'app/blocks/util/directives/CustomTableView.html',
            transclude: {
                leftPaginationMenu: '?leftPaginationMenu',
                leftShowHideMenu: '?leftShowHideMenu'
            },
            scope: {
                headers: '=',
                data: '=',
                total: '=?',
                pagination: '=?',
                promise: '=?',
                searchBox: '=?',
                showHideColumns: '=?',
                userInfo: '=?',
                keyNavigationEnabled: "=?",
                onPaginate: '&?',
                onReorder: '&?',
                onRowClick: '&?',
                onRowDblClick: '&?',
                /**
                 * Select/Deselect one row listener
                 */
                onRowsToggle: '&?',
                onSearchSubmit: '&?',
                onMouseOverOnCell: '&?',
                onMouseLeaveOnCell: '&?',
                hidePager: '&?',
                /**
                 * if you enable it, you can see the Select All button on the left side of top pagination menu
                 * and you switch table to select all mode
                 */
                enableSelectAll: '=?',
                /**
                 * The name of event for forcing table to check all item in current page
                 * To call select all you need to fire this event
                 */
                toggleCurrentPageSelection: '@?',
                /**
                 * The name of event for getting selected item, you need to fire this event with $rootScope.$broadcast(eventName, callback)
                 * In callback you have object parameter like below
                 *
                 * {
                 *      all: true/false ( all items are selected )
                 *      unselected: Array of unselected items
                 *      selected: Array of selected items
                 *      count: selected count ( it get count in select all and normal selection mode )
                 * }
                 */
                getSelectedItemsEvent: '@?',
                /**
                 * The name of event for getting selected item, you need to fire this event with $rootScope.$broadcast(eventName, callback)
                 * In callback you have object parameter like below
                 *
                 * {
                 *      selected: Array of selected items
                 * }
                 */
                getLegacySelectedItemsEvent: '@?',
                /**
                 * The name of event to clear all selection in table
                 */
                clearSelectionEvent: '@?',
                onSelectedCount: '&?',
                /**
                 * function that returns promise, as on rejection value is returned back
                 * to old value
                 */
                onCellValueChange: '&?',
                /**
                 * selectable must be one of two values
                 * - single - single selection is enabled
                 * - multiple - multiple selection is enabled
                 */
                selectable: '@?',
                /**
                 * key-controlled attribute is defined to make the table
                 * control by 'CTRL' key
                 */
                keyControlled: '=?',
                class: '=?'
            }
        };
    }

    CustomTableController.$inject = [
        '$scope',
        '$element',
        '$timeout',
        '$q',
        '$filter',
        '$window',
        '$translate',
        '$mdDialog',
        'CustomEditDialog',
        'Alert',
        'DateUtils',
        'CustomTableUtil',
        'RichTextEditDialog',
        'HtmlTagUtil',
        'StringUtil',
        'TableConstants'
    ];

    /* @ngInject */
    function CustomTableController($scope, $element, $timeout, $q, $filter, $window, $translate, $mdDialog, CustomEditDialog, Alert, DateUtils, CustomTableUtil, RichTextEditDialog, HtmlTagUtil, StringUtil, TableConstants) {
        var vm = this;

        //-- constants --
        var CTRL_KEY = 17;

        // -- START -- below are md-data-table callbacks
        vm.paginate = paginate;
        vm.reorder = reorder;
        vm.onRowSelect = onRowSelect;
        vm.onDblRowSelect = onDblRowSelect;
        vm.onRowDeselect = onRowDeselect;
        vm.onSearch = onSearch;
        vm.onCellClick = onCellClick;
        vm.onCellDblClick = onCellDblClick;
        vm.onCellEnterPress = onCellEnterPress;
        vm.callFunction = callFunction;
        vm.getSuitableData = getSuitableData;
        vm.getSuitableDataParams = getSuitableDataParams;
        vm.getCorrectValue = getCorrectValue;
        vm.openEditDialog = openEditDialog;
        vm.openRichTextDialog = openRichTextDialog;
        vm.getLimitedAndEscapedData = getLimitedAndEscapedData;
        vm.increaseTotalDisplayed = increaseTotalDisplayed;
        vm.onEdit = onEdit;
        vm.onSearchFilter = onSearchFilter;
        vm.getValue = CustomTableUtil.getValue;
        vm.getCellClass = getCellClass;
        vm.onToggleSelectAll = onToggleSelectAll;
        vm.getSelectedCount = getSelectedCount;

        // -- END -- below are md-data-table callbacks
        vm.selected = [];

        vm.selectedProducts = new Set();
        vm.unselectedProducts = new Set();
        vm.selectedAll = false;

        vm.finishMultiple = true;
        vm.searchForm = {};
        vm.currentRowIndx = 0;
        vm.currentCellIndx = 0;
        vm.defaultPagination = {
            page: 1,
            size: 5,
            options: [
                10,
                30,
                50,
                100
            ],
            label: {
                page: $translate.instant('global.customDataTable.page'),
                rowsPerPage: $translate.instant('global.customDataTable.rowsPerPage'),
                of: $translate.instant('global.customDataTable.of')
            }
        };
        vm.defaultHeader = {
            editable: false,
            showHide: true,
            visible: true,
            property: null,
            onClick: null,
            orderBy: null,
            desc: false
        };
        vm.controllKeyPressed = false;
        vm.isEmptyData = true;
        vm.totalDisplayed = 25;
        vm.displayedData = [];
        activate();

        ////////////////////

        function activate() {
            //add arrow navigation to tables after render
            $timeout(
                function () {
                    afterHtmlRender();
                }, 0
            );

            vm.isEmptyData = !vm.data || vm.data.length === 0;

            if (angular.isUndefined(vm.pagination)) {
                vm.pagination = {};
            }
            vm.pagination = angular.extend({}, vm.defaultPagination, vm.pagination);
            if (angular.isDefined(vm.data) && angular.isArray(vm.data)) {
                setPageData(sliceData(vm.data, vm.order));
            }
            registerWatchOnData();
            registerWatchOnHeaders();

            if (angular.isUndefined(vm.total) && vm.data) {
                vm.total = vm.data.length;
            } else if (angular.isUndefined(vm.total)) {
                vm.total = 0;
            }

            if (angular.isUndefined(vm.selectable)) {
                vm.selectable = false;
            }
            if (angular.isArray(vm.headers)) {
                vm.tHeaders = extendHeaders(vm.headers);
            }

            angular.element($window).on('keydown', holdKey);
            angular.element($window).on('keyup', releaseKey);
            //selecting row by click on any cell is enabled if key navigation is not enabled
            vm.rowSelectable = !angular.isDefined(vm.keyNavigationEnabled);

            if (angular.isString(vm.toggleCurrentPageSelection)) {
                $scope.$on(vm.toggleCurrentPageSelection, toggleItemSelection);
            }

            if (angular.isString(vm.getSelectedItemsEvent)) {
                $scope.$on(vm.getSelectedItemsEvent, getAllSelected);
            }

            if (angular.isString(vm.getLegacySelectedItemsEvent)) {
                $scope.$on(vm.getLegacySelectedItemsEvent, getAllLegacySelected);
            }


            if (angular.isString(vm.clearSelectionEvent)) {
                $scope.$on(vm.clearSelectionEvent, clearSelection);
            }

            //////////////////////////////////////////////

            function getAllSelected(event, callback) {
                if (angular.isFunction(callback)) {
                    callback({
                        count: getSelectedCount(),
                        all: vm.selectedAll,
                        unselected: Array.from(vm.unselectedProducts),
                        selected: Array.from(vm.selectedProducts)
                    });
                }
            }

            function getAllLegacySelected(event, callback) {
                if (angular.isFunction(callback)) {
                    callback({
                        selected: Array.from(vm.selected)
                    });
                }
            }

            function clearSelection() {
                vm.selectedAll = false;
                vm.selected.length = 0;
                vm.unselectedProducts.clear();
                vm.selectedProducts.clear();
            }
        }

        function toggleItemSelection(event, deselect) {
            if (deselect) {
                vm.selected.length = 0;
                return;
            }

            vm.selected = Array.from(new Set(vm.data));
        }

        function getSelectedCount() {
            if (vm.selectedAll) {
                return parseInt(vm.total) - vm.unselectedProducts.size;
            }

            return vm.selectedProducts.size;
        }

        function fireCountEvent() {
            if (angular.isFunction(vm.onSelectedCount)) {
                var count = getSelectedCount();
                var func = vm.onSelectedCount({size: count});

                if (angular.isFunction(func)) {
                    func(count);
                }
            }
        }

        function getCellClass(header, model) {
            if (angular.isFunction(header.cellClass)) {
                return header.cellClass(header, model) || '';
            }

            return header.cellClass || '';
        }

        function onToggleSelectAll() {
            vm.selectedProducts.clear();
            vm.unselectedProducts.clear();
            var all = vm.selectedAll;
            vm.selectedAll = !all;
            toggleItemSelection(null, all);

            fireCountEvent();
        }

        function setPageData(pageData) {
            vm.pageData = pageData;
            if (vm.data) {
                vm.totalDisplayed = vm.data.length;
            }
            vm.displayedData = $filter('limitTo')(vm.pageData, vm.totalDisplayed);
            $scope.$emit('page-data:updated');
        }

        function increaseTotalDisplayed() {
            if (!vm.pageData) {
                return;
            }
            if (vm.totalDisplayed + 3 < vm.pageData.length) {
                vm.totalDisplayed += 3;
                vm.displayedData = $filter('limitTo')(vm.pageData, vm.totalDisplayed);
                return;
            }
            vm.totalDisplayed = vm.pageData.length;
            vm.displayedData = $filter('limitTo')(vm.pageData, vm.totalDisplayed);
        }

        function onEdit(header) {
            var config = {
                templateUrl: 'app/blocks/util/directives/table-input/TextInputView.html',
                controller: 'TableInputController',
                controllerAs: 'vm',
                locals: {
                    validations: null
                }
            };

            if (header.edit.type === TableConstants.editType.NUMERIC) {
                config.templateUrl = 'app/blocks/util/directives/table-input/NumericInputView.html';
                config.controller = 'NumericInputController';
            } else if (header.edit.type === TableConstants.editType.BOOLEAN) {
                config.templateUrl = 'app/blocks/util/directives/table-input/BooleanInputView.html';
            } else if (header.edit.type === TableConstants.editType.ENUM) {
                config.templateUrl = 'app/blocks/util/directives/table-input/EnumInputView.html';
                config.controller = 'TableEnumInputController';
            }

            config = angular.merge(config, header.edit.options);
            $mdDialog.show(config).then(header.edit.callback);
        }

        function onSearchFilter(header) {
            var config = {
                templateUrl: 'app/blocks/util/directives/table-input/TextInputView.html',
                controller: 'TableInputController',
                controllerAs: 'vm',
                locals: {
                    validations: null
                }
            };

            if (header.search.type === TableConstants.editType.NUMERIC) {
                config.templateUrl = 'app/blocks/util/directives/table-input/NumericInputView.html';
            } else if (header.search.type === TableConstants.editType.BOOLEAN) {
                config.templateUrl = 'app/blocks/util/directives/table-input/BooleanInputView.html';
            } else if (header.search.type === TableConstants.editType.ENUM) {
                config.templateUrl = 'app/blocks/util/directives/table-input/EnumInputView.html';
                config.controller = 'TableEnumInputController';
            }

            config = angular.merge(config, header.search.options);
            $mdDialog.show(config).then(header.search.callback);
        }


        function afterHtmlRender() {
            vm.tableBody = angular.element($element).find('table tbody');
            registerNavigationListener(vm.tableBody);
        }

        function registerNavigationListener(tableBody) {
            if (!tableBody || tableBody.length === 0) {
                return;
            }
            angular.element(tableBody).on('keydown', navigationListener);
        }

        function navigationListener(event) {
            if (event.keyCode === 37 && vm.currentCellIndx > 0) {
                //move left
                vm.currentCellIndx--;
                changeCellPosition('right');
                return false;
            }
            if (event.keyCode === 38 && vm.currentRowIndx > 0) {
                //move up
                vm.currentRowIndx--;
                changeCellPosition('down');
                return false;
            }
            if (event.keyCode === 39 && vm.currentCellIndx < vm.tHeaders.length) {
                //move right
                vm.currentCellIndx++;
                changeCellPosition('left');
                return false;
            }
            if (event.keyCode === 40 && vm.pageData && vm.currentRowIndx < vm.pageData.length - 1) {
                //move down
                vm.currentRowIndx++;
                changeCellPosition('up');
                return false;
            }
        }

        function extendHeaders(headers) {
            var extendedHeaders = [];
            for (var i = 0; i < headers.length; i++) {
                if (angular.isDefined(headers[i])) {
                    var extend = angular.extend({}, vm.defaultHeader, headers[i]);
                    extendedHeaders.push(angular.extend(headers[i], extend));
                }
            }
            return extendedHeaders;
        }

        function changeCellPosition(fromDir) {
            if (!vm.tableBody || vm.tableBody.length === 0) {
                return;
            }
            var prevCell = vm.currentCell;
            var currentRow = vm.tableBody.find('tr')[vm.currentRowIndx];
            if (!currentRow) {
                return;
            }
            vm.currentCell = currentRow.children[vm.currentCellIndx];
            if (vm.currentCell) {
                //if current cell is now checkbox column cell
                if (isCellCheckbox(vm.currentCell)) {
                    vm.currentCell = prevCell;
                    handleCheckboxCellPositioning(fromDir);
                    return;
                }
                //if current cell is hidden column cell
                if (isCellHidden(vm.currentCell)) {
                    handleHiddenCellPositioning(fromDir);
                }
                if (prevCell) {
                    angular.element(prevCell).removeClass("active-cell");
                }
                vm.currentCell.focus();
                angular.element(vm.currentCell).addClass("active-cell");
                return;
            }
            vm.currentCell = prevCell;
        }

        function isCellHidden(cell) {
            return angular.element(cell).hasClass('ng-hide');
        }

        function handleHiddenCellPositioning(fromDir) {
            switch (fromDir) {
                case 'up':
                    vm.currentRowIndx++;
                    break;
                case 'down':
                    vm.currentRowIndx--;
                    break;
                case 'left':
                    vm.currentCellIndx++;
                    break;
                case 'right':
                    vm.currentCellIndx--;
                    break;
            }
            changeCellPosition(fromDir);
        }

        function handleCheckboxCellPositioning(fromDir) {
            switch (fromDir) {
                case 'up':
                    vm.currentRowIndx--;
                    break;
                case 'down':
                    vm.currentRowIndx++;
                    break;
                case 'left':
                    vm.currentCellIndx--;
                    break;
                case 'right':
                    vm.currentCellIndx++;
                    break;
            }
        }

        function isCellCheckbox(cell) {
            return angular.element(cell).find("md-checkbox").length > 0
        }

        function isEditableField(model, header) {
            if (angular.isFunction(header.editable)) {
                return header.editable(model, header);
            }
            return header.editable;
        }

        function onCellClick(event, model, header) {
            var cellElement = angular.element(event.target);
            vm.currentRowIndx = cellElement.parent().parent().children().index(cellElement.parent());
            vm.currentCellIndx = cellElement.parent().children().index(cellElement);
            if (!vm.selectable) {
                vm.currentCellIndx += 1;
            }
            changeCellPosition();
        }

        function onCellDblClick(event, model, header) {
            var isEditable = isEditableField(model, header);
            if (isEditable && !vm.keyNavigationEnabled) {
                if (header.type === 'text') {
                    vm.openRichTextDialog(event, model, header);
                    return;
                }
                vm.openEditDialog(event, model, header);
                return;
            }

            onCellClick(event, model, header);

            if (isEditable && vm.keyNavigationEnabled) {
                if (header.type === 'text') {
                    vm.openRichTextDialog(event, model, header);
                    return;
                }
                vm.openEditDialog(event, model, header);
            }

            vm.selected.length = 0;
        }

        function onCellEnterPress(event, model, header) {
            vm.onCellDblClick(event, model, header);
        }

        function callFunction(fn, model, header) {
            if (angular.isFunction(fn)) {
                return fn(model, header);
            }
        }

        function registerWatchOnData() {
            $scope.$watchCollection(
                function watchData(scope) {
                    return vm.data;
                },
                function handleChange(newValue, oldValue) {
                    vm.isEmptyData = !newValue || newValue.length === 0;
                    setPageData(sliceData(newValue, vm.order));
                }
            );
        }

        function registerWatchOnHeaders() {
            $scope.$watchCollection(
                function watchData(scope) {
                    return vm.headers;
                },
                function handleChange(newValue, oldValue) {
                    if (!angular.isArray(newValue)) {
                        return;
                    }
                    vm.tHeaders = extendHeaders(newValue);
                }
            );
        }

        function getSuitableDataParams(data, header) {
            return CustomTableUtil.getValue(data, header.params);
        }

        function getCorrectValue(model, header) {
            var value = header.type === 'text' ? getLimitedAndEscapedData(model, header) : getSuitableData(model, header);

            if (!value) {
                return $translate.instant('global.no_value');
            }

            return value;
        }

        function getSuitableData(data, header) {
            var val = CustomTableUtil.getFieldValue(data, header);

            if (angular.isUndefined(val) || val == null) {
                return '';
            }

            if (header.property) {
                if (header.property === 'length') {
                    val = val[header.property];
                }
                //add more function if needed
            }

            if (header.type && (header.type === 'date' || header.type === 'datetime')) {
                val = DateUtils.getFormattedDate(Date.parse(val));
            }

            if (angular.isFunction(header.applyFilterIf) && !header.applyFilterIf(data, header)) {
                return val;
            }

            if (header.filter) {
                try {
                    val = $filter(header.filter)(val, header.filterParams);
                } catch (e) {
                    val = 'Filter does not exist';
                }
            }

            return val;
        }

        function onSearch(searchText) {
            if (angular.isFunction(vm.onSearchSubmit)) {
                vm.onSearchSubmit(searchText);
                return;
            }
            setPageData(sliceData(vm.data, vm.order));
            if (searchText && searchText.length > 0) {
                Alert.info($translate.instant('global.customDataTable.searchFound', {found: '' + vm.total}));
            }
        }

        function getSearchedData(data, searchText) {
            if (!angular.isArray(data) || !searchText || searchText.length === 0) {
                return data;
            }
            return $filter('filter')(data, vm.searchForm.searchText);
        }

        /**
         * function= callback called when a pagination parameters like size, page is changed,
         * calls onPaginate callback if it were defined
         *
         * onPaginate function is expected to be called with onPaginate(page, pageSize)
         * @param page
         * @param pageSize
         */

        function paginate(page, pageSize) {
            vm.finishMultiple = true;
            vm.pagination.page = page;
            vm.pagination.size = pageSize;
            if (angular.isFunction(vm.onPaginate)) {
                vm.onPaginate(
                    {
                        page: page,
                        pageSize: pageSize
                    }
                );
                return;
            }
            setPageData(sliceData(vm.data, vm.pagination.order));
        }

        function isRemotePagination() {
            return vm.onPaginate || vm.data.length <= vm.pagination.size;
        }

        function sliceData(data, order) {
            if (!angular.isArray(data)) {
                return data;
            }
            var slicedData = data;
            var offset = 0;
            //apply first search on data
            if (!vm.onSearchSubmit && vm.searchForm.searchText && vm.searchForm.searchText.length > 0) {
                slicedData = getSearchedData(data, vm.searchForm.searchText);
                vm.total = slicedData.length;
                offset = (vm.pagination.page - 1) * vm.pagination.size;
            }
            //apply order if there is any
            if (!vm.onReorder && order) {
                slicedData = getOrderedData(slicedData, order);
            }
            //if no remote pagination and static data length is higher then page size
            //then offset should be calculated for static data
            if (!isRemotePagination()) {
                offset = (vm.pagination.page - 1) * vm.pagination.size;
            }
            slicedData = slicedData.slice(offset, offset + vm.pagination.size);
            return slicedData;
        }

        function getOrderedData(data, order) {
            if (!angular.isArray(data)) {
                return data;
            }
            if (order && angular.isString(order)) {
                var predicate = order;
                var reverse = false;
                if (order.indexOf('-') !== -1) {
                    predicate = order.split('-')[1];
                    reverse = true;
                }
                return $filter('orderBy')(data, predicate, reverse);
            }
            return data;
        }

        function reorder(order) {
            if (angular.isDefined(vm.onReorder)) {
                vm.onReorder(
                    {
                        order: order
                    }
                );
                return;
            }
            setPageData(sliceData(vm.data, order));
        }

        function selectionEnabled() {
            if (!vm.keyControlled) {
                return angular.isDefined(vm.selectable);
            }
            return angular.isDefined(vm.selectable) && vm.controllKeyPressed;
        }

        function isSelectAllPerPage() {
            if (vm.pageData && vm.selected && vm.selected.length % vm.pagination.size === vm.totalDisplayed) {
                angular.forEach(vm.selected, function (selectedOne) {
                    if (vm.pageData.indexOf(selectedOne) === -1) {
                        return false;
                    }
                });
                return true;
            }
            return false;
        }

        function onDblRowSelect(model) {
            if (angular.isFunction(vm.onRowDblClick)) {
                vm.onRowDblClick(
                    {
                        model: model
                    }
                );
            }
        }

        function onRowSelect(model) {
            if (!selectionEnabled() && vm.selected.length <= 1) {
                if (!angular.isDefined(vm.keyNavigationEnabled)) {
                    if (angular.isFunction(vm.onRowClick)) {
                        vm.onRowClick(
                            {
                                model: model
                            }
                        );
                    }
                    callRowToggle(model, false);
                }
                // do not set new array, instead clear it
                vm.selected.length = 0;
                return;
            }
            if (isSelectAllPerPage()) {
                for (var start = vm.totalDisplayed; start < vm.pageData.length; start++) {
                    if (vm.selected.indexOf(vm.pageData[start]) === -1) {
                        vm.selected.push(vm.pageData[start]);
                    }
                }
            }
            callRowToggle(model, false);
        }

        function onRowDeselect(model) {
            if (selectionEnabled() && vm.selected.length === 0) {
                updateScope(
                    function () {
                        vm.controllKeyPressed = !vm.keyControlled;
                    }
                );
            }

            callRowToggle(model, true);
        }

        function holdKey(event) {
            // on hold keys
            if (event.keyCode === CTRL_KEY) {
                updateScope(
                    function () {
                        vm.controllKeyPressed = true;
                    }
                );
            }
        }

        function releaseKey(event) {
            // on release keys
            if (event.keyCode === CTRL_KEY) {
                updateScope(
                    function () {
                        if (selectionEnabled() && vm.keyControlled && vm.selected.length === 0) {
                            vm.controllKeyPressed = false;
                        }
                    }
                );
            }
        }

        function callRowToggle(item, unchecked) {
            if (angular.isFunction(vm.onRowsToggle)) {
                var func = vm.onRowsToggle({
                    item: item,
                    unchecked: unchecked
                });

                if (angular.isFunction(func)) {
                    func(item, unchecked);
                }
            }

            if (vm.enableSelectAll) {
                var first = vm.unselectedProducts;
                var second = vm.selectedProducts;

                if (unchecked) {
                    first = vm.selectedProducts;
                    second = vm.unselectedProducts;
                }

                second.add(item.id);
                first.delete(item.id);

                if (unchecked && vm.selectedAll) {
                    vm.selectedAll = vm.getSelectedCount() !== 0;
                }
            }

            fireCountEvent();
        }

        function updateScope(callback) {
            $timeout(
                function () {
                    $scope.$apply(callback);
                }, 0
            );
        }

        function callOnCellSaveCallback(header, model, newValue, oldValue) {
            if (angular.isFunction(vm.onCellValueChange)) {
                return vm.onCellValueChange(
                    {
                        header: header,
                        model: model,
                        newValue: newValue,
                        oldValue: oldValue
                    }
                );
            }
            var defer = $q.defer();
            defer.resolve(true);
            return defer.promise;
        }

        function openRichTextDialog(event, model, header) {
            event.stopPropagation();
            RichTextEditDialog.showDialog(
                {
                    modelValue: CustomTableUtil.getFieldValue(model, header),
                    targetEvent: event,
                    onSave: function (text) {
                        var oldValue = CustomTableUtil.getFieldValue(model, header);
                        if (oldValue === text) {
                            //no change
                            returnFocusToCell();
                            return;
                        }
                        //first set value
                        CustomTableUtil.setValue(model, header.field, text);
                        //if remote function should be called call it
                        callOnCellSaveCallback(header.field, model, text, oldValue).catch(
                            function (updatedModel) {
                                model = updatedModel;
                            }
                        );
                        returnFocusToCell();
                    }
                }
            );
        }

        function returnFocusToCell() {
            if (vm.keyNavigationEnabled && vm.currentCell) {
                vm.currentCell.focus();
            }
        }

        function openEditDialog(event, model, header) {
            if (event) {
                event.stopPropagation();
            }
            function checkAndSave(newValue) {
                var oldValue = CustomTableUtil.getFieldValue(model, header);
                if (oldValue === newValue) {
                    //no change
                    returnFocusToCell();
                    return;
                }
                //first set value
                CustomTableUtil.setValue(model, header.field, newValue);
                //if remote function should be called call it
                callOnCellSaveCallback(header.field, model, newValue, oldValue).catch(
                    function (updatedModel) {
                        model = updatedModel;
                    }
                );
            }

            CustomEditDialog.showDialog(
                {
                    modelValue: CustomTableUtil.getFieldValue(model, header),
                    placeHolder: header.text,
                    type: header.type ? header.type : 'text',
                    afterOutsideToClose: function (value) {
                        checkAndSave(value);
                        returnFocusToCell();
                    },
                    afterEscToClose: function (value) {
                        checkAndSave(value);
                        returnFocusToCell();
                    },
                    save: function (input) {
                        checkAndSave(input.$modelValue);
                        returnFocusToCell();
                    },
                    targetEvent: event,
                    validators: header.validators
                }
            );
        }

        function getLimitedAndEscapedData(data, header) {
            var richTextValue = CustomTableUtil.getFieldValue(data, header);
            if (!richTextValue || richTextValue === '') {
                return richTextValue;
            }
            richTextValue = HtmlTagUtil.escapeTags(richTextValue);
            return StringUtil.limitTo(richTextValue, 100);
        }
    }
})(angular);
