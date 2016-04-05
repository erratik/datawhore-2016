;(function (angular) {
    'use strict';

    angular.module('directives.postConfig', [])
        .directive('postConfig', function () {
        return {
            restrict: 'E',
            scope: true,
            controller: 'controllers.Networks',
            link: function (scope, element, attrs) {
     //        	if (scope.network.namespace.configured) {
					// element.html('<div class="right floated compact ui button" ng-click="deleteNetworkNamespace(\'{{network.namespace}}\')">Remove</div>');
     //        	} else {
					// element.html('<div class="right floated compact ui button" ng-click="">Configure</div>');
     //        	}
            }
        };
    });    



})(angular);
