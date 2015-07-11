;(function (angular) {
    'use strict';

    angular.module('directives.profileUpdated', ['angularMoment'])
        .directive('profileUpdated', function () {
        return {
            restrict: 'EA',
            scope: "&",
            link: function (scope, element, attrs) {
                var $parentScope = scope.$parent.$parent;
            	if (typeof $parentScope.profiles[attrs.namespace] != 'undefined') {
					element.html('Last saved ' + moment.unix($parentScope.profiles[attrs.namespace].last_modified).fromNow());
            	} else {
                    element.html('No profile saved.');
            	}
            }
        };
    });    

    var tpl_folder = 'templates/directives';
    angular.module('directives.profileAvatar', [])
        .directive('profileAvatar', function () {
        return {
            restrict: 'E',
            scope:  "=",
            controller: function ($scope) {
                // console.log($scope);
            },
            templateUrl: tpl_folder+'/profile-avatar.html',
            link: function (scope, element, attrs) {
                var $parentScope = scope.$parent.$parent;
                // console.log($parentScope);
                if (typeof $parentScope.profiles[attrs.namespace] != 'undefined') {
                    console.log($parentScope.profiles[attrs.namespace]);
                    console.log(element);
                    // element.html('Last saved ' + moment.unix($parentScope.profiles[attrs.namespace].last_modified).fromNow());
                } else {
                    // element.html('No profile saved.');
                }
            }
        };
    });

    // angular.module('directives.disconnectNamespace', [])
    //     .directive('disconnectNamespace', function () {
    //     return {
    //         restrict: 'E',
    //         template: '<div class="ui negative mini button" ng-show="network.connected">Disconnect</div>',
    //         link: function (scope, element, attrs) {
    //             element.on('click', function(){
    //                 scope.disconnectNamespace(scope.network.namespace);
    //             });
    //         }
    //     };
    // });

    // angular.module('directives.removeNamespace', [])
    //     .directive('removeNamespace', function () {
    //     return {
    //         restrict: 'E',
    //         template: '<div class="ui negative button">Remove</div>',
    //         link: function (scope, element, attrs) {
    //             element.on('click', function(){
    //                 scope.deleteNetworkNamespace(scope.network.namespace);
    //             });
    //         }
    //     };
    // });

    // angular.module('directives.configureNamespace', [])
    //     .directive('configureNamespace', function () {
    //     return {
    //         restrict: 'E',
    //         template: '<div class="ui positive button">Save</div>',
    //         link: function (scope, element, attrs) {
    //             element.on('click', function(){
    //                 scope.configureNetwork(scope.network.namespace);
    //             });
    //         }
    //     };
    // });

    // angular.module('directives.customProperties', [])
    //     .directive('customProperties', function () {
    //     return {
    //         restrict: 'E',
    //         template: '<textarea ng-model="formData.customProperties" placeholder="Add image filename"></textarea>'//
    //     };
    // });

})(angular);
