;(function (angular) {
    'use strict';
    var tpl_folder = 'templates/directives';

    angular.module('directives.profileUpdated', ['angularMoment'])
        .directive('profileUpdated', function () {
        return {
            restrict: 'E',
            scope: {
                date: '@'
            },
            template: 'No profile saved.',
            link: function (scope, element, attrs) {

                if (attrs.date) 
                    element.html('Last saved ' + moment.unix(attrs.date).fromNow());
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
            template: '<div class="right mini ui button trigger" ng-click="done({namespace:namespace})"><img src="/images/settings/{{namespace}}.png" class="micro">Update Profile </div>'
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
                namespace: "@",
                avatar: "@"
            },
            controller: function ($scope, $attrs) {
                this.bla = function () {
                    console.log($attrs);
                }
            },
            template: '<img src="/images/settings/{{namespace}}.png" class="ui right floated mini avatar">',
            link: function (scope, element, attrs, profileController) {

                if (scope.avatar) {
                    element.html('<img src="'+ scope.avatar +'" class="ui right floated mini avatar">');

                }
                scope.$watch('avatar', function(newVal) {
                    if(newVal) { 
                        element.html('<img src="'+ scope.avatar +'" class="ui  mini avatar image">');
                    }
                }, true);
            }
        };
    });

    angular.module('directives.profileUsername', [])
        .directive('profileUsername', function () {
        return {
            restrict: 'E',
            scope: {
                namespace: "@",
                username: "@"
            },
            template: '{{namespace}}',
            link: function (scope, element, attrs) {
                if (scope.username) {
                    element.text('@'+scope.username);

                }
            }
        };
    });




/*
    angular.module('directives.profileCard', [])
        .directive('profileCard', function () {
        return {
            restrict: 'E',
            scope:{},
            controller: function ($scope) {
                console.log($scope);
                this.addProfile = function(namespace){
                    $scope['namespace'] = namespace;
                    $scope['profile'] = $scope.$parent.$parent.model.profiles[namespace];
                    $scope['config'] = $scope.$parent.$parent.model.configs[namespace];
                }
            },
            templateUrl: tpl_folder+'/profile--card.html',
            link: function (scope, element, attrs) {
                element.bind('mouseenter',function(){
                    console.log(scope.config);
                });
            }
        };
    })
    .directive('namespace', function () {
        return {
            require: 'profileCard',
            link: function (scope, element, attrs, profileCardCtrl) {
                // console.log(attrs);
                profileCardCtrl.addProfile(attrs.namespace);
            }
        };
    })
    .directive('last_modified', function () {
        return {
            require: 'profileCard',
            link: function (scope, element, attrs, profileCardCtrl) {
                profileCardCtrl.addNamespace(attrs.name);
            }
        };
    });

*/


})(angular);
