;(function (angular) {
    'use strict';
    var tpl_folder = 'templates/directives';

    angular.module('directives.profileUpdated', ['angularMoment'])
        .directive('profileUpdated', function () {
        return {
            restrict: 'E',
            scope: {
                date: '='
            },
            template: 'No profile saved.',
            link: function (scope, element, attrs) {

                if (scope.date) 
                    element.html('Last saved ' + moment.unix(scope.date).fromNow());

                // scope.$watch('date', function(newVal) {
                //     if(newVal.length) { 
                //     element.html('Last saved ' + moment.unix(attrs.date).fromNow());
                //     }
                // }, true);
            }
        };
    });    

    angular.module('directives.profileFetch', ['angularMoment'])
        .directive('profileFetch', function () {
        return {
            restrict: 'E',
            scope: {
                done: "&",
                namespace: "@"
            },
            template: '<div class="right mini ui button trigger" ng-click="done({namespace:namespace})"><img src="/images/settings/{{namespace}}.png" class="micro">Fetch Profile </div>'
        };
    });       

    angular.module('directives.profileRemove', ['angularMoment'])
        .directive('profileRemove', function () {
        return {
            restrict: 'E',
            scope: {
                done: "&",
                namespace: "@"
            },
            template: '<div class="right mini ui button trigger" ng-click="done({namespace:namespace})"><i class="icon remove"></i>Wipe </div>'
        };
    });    

    angular.module('directives.profileAvatar', [])
        .directive('profileAvatar', function () {
        return {
            restrict: 'E',
            scope: {
                namespace: "=",
                profile: "=",
                styles: "@"
            },
            templateUrl: 'templates/directives/profile--avatar.html',
            link: function (scope, element, attrs) {

                // if (scope.avatar) {
                //     element.html('<img src="'+ scope.avatar +'" class="mini avatar">').addClass(scope.styles);
                // }
                // scope.$watch('avatar', function(newVal) {
                //     // console.log(scope.namespace);
                //     if(newVal.length) { 
                //         element.html('<img src="'+ scope.avatar +'" class="mini avatar">').addClass(scope.styles);
                //     } else {
                //         element.html('<img src="/images/settings/'+ scope.namespace +'.png" class="mini avatar">').addClass(scope.styles);
                //     }
                // }, true);

            }
        };
    });

    angular.module('directives.profileUsername', [])
        .directive('profileUsername', function () {
        return {
            restrict: 'E',
            scope: {
                profile: "=",
                namespace: "=",
                username: "="
            },
            template: '{{namespace}}',
            link: function (scope, element, attrs) {
                if (scope.username) 
                    element.html('@'+scope.username+'');
                // element.wrap('<h4></h4>');

            }
        };
    });

    angular.module('directives.profileRow', [])
        .directive('profileRow', function () {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                data: "="
            },
            templateUrl: 'templates/directives/profile--single-row.html',
            link: function (scope, element, attrs) {
               
            }
        };
    });
    angular.module('directives.profileCard', [])
        .directive('profileCard', function () {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                profiles: "=",
                configs: "="
            },
            templateUrl: 'templates/directives/profile--card.html',
            link: function (scope, element, attrs) {
                console.log('hello');
               // element.prepend('<tr><th id="par" class="span" colspan="5" scope="colgroup">Attribute</th></tr>');
            }
        };
    });



})(angular);
