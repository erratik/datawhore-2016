;(function (angular) {
    'use strict';
    var tpl_folder = 'templates/directives';

    angular.module('directives.profileUpdated', ['angularMoment'])
        .directive('profileUpdated', function () {
        return {
            restrict: 'EA',
            scope: {},
            template: 'No profile saved.',
            link: function (scope, element, attrs) {

                // var thisProfile = scope.namespace;
// console.log(attrs);
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
            restrict: 'EA',
            scope: "=",
            link: function (scope, element, attrs) {
                
                var thisProfile = scope['profile'];

                if (typeof thisProfile != 'undefined') {

                    var markup = '<div class="right mini ui button trigger">';
                    
                        markup +=  '<i class="trash icon"></i>Wipe';

                        markup += '</div>';

                    element.html(markup);
                }

            }
        };
    });    

    angular.module('directives.profileAvatar', [])
        .directive('profileAvatar', function () {
        return {
            restrict: 'EA',
            scope:  {
                namespace: "@",
                saved: "@",
                avatar: "@"
            },
            template: '<img src="/images/settings/{{namespace}}.png" class="ui avatar">',
            link: function (scope, element, attrs) {
                
                // console.log(attrs.$attr);
                // var thisProfile = scope['profile'];
                // // console.log(scope);
                if (scope.saved) {
                    element.html('<img src="'+ scope.avatar +'" class="ui avatar">');

                }
            }
        };
    });


    angular.module('directives.profileCard', [])
        .directive('profileCard', function () {
        return {
            restrict: 'E',
            scope: '=',
            controller: function ($scope) {
                console.log($scope);
                // $scope.model = {};
                this.addProfile = function(){
                    $scope.profile.saved = true;
                }
            },
            templateUrl: tpl_folder+'/profile--card.html',
            link: function (scope, element, attrs) {
                console.log(scope);
            }
        };
    })
    .directive('profile', function () {
        return {
            restrict: 'E',
            require: 'profileCard',
            link: function (scope, element, attrs, profileCard) {
                console.log(attrs);
                profileCard.addProfile();
            }
        };
    });

})(angular);
