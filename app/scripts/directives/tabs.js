/**
 * The angular tabs module
 * @author: nerv
 * @version: 0.2.5, 2012-08-25
 */
define(['./module'], function (directives) {
    'use strict';
    directives
        .directive('ngTabs', ngTabsDirective)
        .directive('ngTabHead', ngTabHeadDirective)
        .directive('ngTabBody', ngTabBodyDirective);

    function ngTabsDirective() {
        return {
            scope: true,
            restrict: 'EAC',
            controller: ngTabsController
        };
    }

    function ngTabsController($scope) {
        $scope.tabs = {
            index: 0,
            count: 0
        };

        this.headIndex = 0;
        this.bodyIndex = 0;

        this.getTabHeadIndex = function () {
            return $scope.tabs.count = ++this.headIndex;
        };

        this.getTabBodyIndex = function () {
            return ++this.bodyIndex;
        };
    }

    ngTabsController.$inject = ['$scope'];



    function ngTabHeadDirective() {
        return {
            scope: false,
            restrict: 'EAC',
            require: '^ngTabs',
            link: function (scope, element, attributes, controller) {
                var index = controller.getTabHeadIndex();
                var value = attributes.ngTabHead;
                var active = /[-*\/%^=!<>&|]/.test(value) ? scope.$eval(value) : !!value;

                scope.tabs.index = scope.tabs.index || ( active ? index : null );

                element.bind('click', function () {
                    scope.tabs.index = index;
                    scope.$$phase || scope.$apply();
                });

                scope.$watch('tabs.index', function () {
                    element.toggleClass('active', scope.tabs.index === index);
                });
            }
        };
    }


    function ngTabBodyDirective() {
        return {
            scope: false,
            restrict: 'EAC',
            require: '^ngTabs',
            link: function (scope, element, attributes, controller) {
                var index = controller.getTabBodyIndex();

                scope.$watch('tabs.index', function () {
                    element.toggleClass(attributes.ngTabBody + ' ng-show', scope.tabs.index === index);
                });
            }
        };
    }

});