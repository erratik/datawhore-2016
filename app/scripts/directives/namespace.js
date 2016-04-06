define(['./module'], function (directives) {
    'use strict';
    var tpl_folder = 'templates/directives/';
    directives
        .directive('namespaceToggle', function () {
            return {
                restrict: 'E',
                scope: "&",
                controller: function ($scope) {
                    console.log($scope);
                },
                template: '',
                link: function (scope, element, attrs) {
                    if (scope.network.namespace.configured) {
                        element.html('<div class="right floated compact ui button" ng-click="deleteNetworkNamespace(\'{{network.namespace}}\')">Remove</div>');
                    } else {
                        element.html('<div class="right floated compact ui button" ng-click="">Configure</div>');
                    }
                }
            };
        })
        .directive('disconnectNamespace', function () {
            return {
                restrict: 'E',
                template: '<div class="ui negative mini button negative" ng-show="network.connected"><i class="exchange icon"></i></div>',
                link: function (scope, element, attrs) {
                    element.on('click', function () {
                        scope.disconnectNetwork(scope.network.namespace);
                    });
                }
            };
        })
        .directive('removeNamespace', function () {
            return {
                restrict: 'E',
                template: '<div class="ui negative mini button">Remove</div>',
                link: function (scope, element, attrs) {
                    element.on('click', function () {
                        scope.deleteNetworkNamespace(scope.network.namespace);
                    });
                }
            };
        })
        .directive('configureNamespace', function () {
            return {
                restrict: 'E',
                template: '<div class="ui positive button">Configure</div>',
                link: function (scope, element, attrs) {
                    element.on('click', function () {
                        scope.configureNetwork(scope.network.namespace);
                    });
                }
            };
        })
        .directive('detailsNamespace', function () {
            return {
                restrict: 'E',
                scope: "&",

                templateUrl: tpl_folder + 'network-details.html',
                controller: function ($scope, $compile) {

                },
                link: function (scope, element, attrs) {
                    console.log(element);
                }
            };
        })
        .directive('customProperties', function () {
            return {
                restrict: 'E',
                template: '<textarea ng-model="formData.customProperties" placeholder="Add image filename"></textarea>'//
            };
        })

});
