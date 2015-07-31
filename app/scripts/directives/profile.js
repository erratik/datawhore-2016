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
            controller: function($scope){
                console.log($scope)
            },
            link: function (scope, element, attrs) {

                // var thisProfile = scope.namespace;
                console.log(attrs.date);
                if (attrs.date) 
                    element.html('Last saved ' + moment.unix(attrs.date).fromNow());
                // } else {
                //     element.html('No profile saved.');
                // }
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
            template: '<div class="right mini ui button trigger" ng-click="done({namespace:namespace})"><img src="/images/settings/{{namespace}}.png" class="micro">Update Profile </div>',
            link: function (scope, element, attrs) {
                // var thisProfile = scope['profile'];
                // var markup = '<div class="right mini ui button trigger" ng-click="getProfile({profile.name})"><img src="/images/settings/'+attrs.namespace+'.png" class="micro">';
                
                // markup += (typeof thisProfile != 'undefined') ? 'Update' : 'Get';

                // markup += ' profile</div>';

                // element.html(markup);
            }
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
            template: '<div class="right mini ui button trigger" ng-click="done({namespace:namespace})"><i class="icon remove"></i>Wipe </div>',

            link: function (scope, element, attrs) {
                
                // var thisProfile = scope['profile'];

                // if (typeof thisProfile != 'undefined') {

                //     var markup = '<div class="right mini ui button trigger">';
                    
                //         markup +=  '<i class="trash icon"></i>Wipe';

                //         markup += '</div>';

                //     element.html(markup);
                // }

            }
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
                template: '<img src="/images/settings/{{namespace}}.png" class="ui right floated mini avatar">',
                link: function (scope, element, attrs) {
                    if (scope.avatar) {
                        element.html('<img src="'+ scope.avatar +'" class="ui right floated mini avatar">');

                    }
                }
            };
        })


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




})(angular);
