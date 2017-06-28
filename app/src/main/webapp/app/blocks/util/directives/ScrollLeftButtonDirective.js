angular
    .module('app.blocks')
    .directive('scrollLeftButton', ScrollLeftButtonDirective);

ScrollLeftButtonDirective.$inject = ['$timeout', '$window'];
/* @ngInject */
function ScrollLeftButtonDirective($timeout, $window) {
    return {
        template: '<md-button class="md-raised scroll left"><md-icon>keyboard_arrow_left</md-icon></md-button>',
        restrict: 'E',
        scope: {},
        compile: compileFn
    };

    function compileFn(tElement) {
        return function(scope, element) {
            var scrollContainer = element.parent();
            scrollContainer.css('position', 'relative');
            var container = element.children().first();
            container.css('marginTop', '200px');
            var pressed = false;

            showHide();

            container.on('click', function() {
                scrollContainer[0].scrollLeft=scrollContainer[0].scrollLeft - 100;
                scrollButton();
            });

            angular.element($window).bind('scroll', function() {
                var scrollOffset = scrollContainer.offset();
                var el = angular.element(this);
                var scrollTop = el.scrollTop();

                if ((scrollTop > 200) && (scrollTop < scrollOffset.top - 200 + scrollContainer.height())) {
                    container.css('marginTop', scrollTop+"px");
                } else if (scrollTop <= 200) {
                    container.css('marginTop', "200px");
                }
            });

            scrollContainer.on('scroll', function() {
                scrollButton();
            });

            container.on('mousedown', function() {
                pressed = true;
                smoothScroll();
            });

            container.on('mouseup', function() {
                pressed = false;
            });

            function smoothScroll() {
                $timeout(function(){
                    if (!pressed) {
                        return;
                    }
                    scrollContainer[0].scrollLeft=scrollContainer[0].scrollLeft - 20;
                    scrollButton();
                    smoothScroll();
                }, 100);
            }

            function showHide() {
                var scrollLeft = scrollContainer.scrollLeft();
                if (scrollLeft === 0) {
                    pressed = false;
                    container.css('display', 'none');
                } else {
                    container.css('display', 'block');
                }
            }

            function scrollButton() {
                container.css('marginLeft', scrollContainer.prop('scrollLeft')+"px");
                showHide();
            }
        };
    }
}
