/*
 * Angular Fixed Table Header
 * https://github.com/daniel-nagy/fixed-table-header
 * @license MIT
 * v0.2.1
 */
(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('fixHead', fixHead);

    fixHead.$inject = ['$window', '$timeout', '$compile'];

    function fixHead($window, $timeout, $compile) {
        return {
            compile: compileFn
        };

        function compileFn(tElement) {
            var header = {
                clone: tElement.clone(),
                original: tElement
            };

            header.clone.removeAttr('fix-head').removeAttr('ng-if');
            //need to compile within original table, out of original table checkbox won't work
            header.original.after(header.clone);
            //table.clone.append(header.clone);

            return function(scope, element) {
                var table = {
                    clone: element.parent().clone().empty(),
                    original: element.parent()
                };

                //hide the clone header, which will be shown on scroll only
                table.clone.css({
                    position: 'fixed',
                    top: 0,
                    display: 'none',
                    backgroundColor: 'white',
                    zIndex: '33'
                });

                $compile(table.clone)(scope);
                table.clone.html(element);
                header.original = table.original.find('thead');

                var scrollContainer = table.original.parent();
                scrollContainer.parent()[0].insertBefore(table.clone[0], scrollContainer[0]);

                scrollContainer.on('scroll', function () {
                    // use CSS transforms to move the cloned header when the table is scrolled horizontally
                    element.css('transform', 'translate3d(' + -(scrollContainer.prop('scrollLeft')) + 'px, 0, 0)');
                });

                angular.element($window).bind('scroll', function(){
                    var tableOffset = scrollContainer.offset();
                    var el = angular.element(this);
                    var scrollTop = el.scrollTop();

                    if ((scrollTop > tableOffset.top) && (scrollTop < tableOffset.top + scrollContainer.height())) {
                        table.clone.css("display", "block");
                    } else {
                        table.clone.css("display", "none");
                    }
                });

                function cells() {
                    return element.find('th').length;
                }

                function getCells(node) {
                    return Array.prototype.map.call(node.find('th'), function (cell) {
                        return jQLite(cell);
                    });
                }

                function jQLite(node) {
                    return angular.element(node);
                }

                function updateCells() {
                    var cells = {
                        clone: getCells(element),
                        original: getCells(header.original)
                    };

                    cells.clone.forEach(function (clone, index) {
                        if(clone.data('isClone')) {
                            return;
                        }

                        // prevent duplicating watch listeners
                        clone.data('isClone', true);

                        var cell = cells.original[index] || cells.clone[index];
                        var style = $window.getComputedStyle(cell[0] || {});

                        var getWidth = function () {
                            return style.width;
                        };

                        var setWidth = function () {
                            clone.css({minWidth: style.width, maxWidth: style.width});
                        };

                        var listener = scope.$watch(getWidth, setWidth);

                        $window.addEventListener('resize', setWidth);

                        clone.on('$destroy', function () {
                            listener();
                            $window.removeEventListener('resize', setWidth);
                        });

                        cell.on('$destroy', function () {
                            clone.remove();
                        });
                    });
                }

                $timeout(function(){
                    scope.$watch(cells, updateCells);
                });

                header.original.on('$destroy', function () {
                    element.remove();
                });
            }
        }
    }
})(angular);
