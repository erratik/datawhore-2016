define(['./module'], function (directives) {
    'use strict';
    directives
        .directive('profileAvatar', function () {
            return {
                restrict: 'E',
                scope: {
                    namespace: "=",
                    profile: "=",
                    styles: "@"
                },
                templateUrl: 'templates/directives/profile--avatar.html'
            };
        })
        .directive('profileCard', function () {
            return {
                replace: true,
                restrict: 'E',
                scope: {
                    configs: "=",
                    networks: "="
                },
                templateUrl: 'templates/directives/profile--card.html',
                link: function (scope, element, attrs) {
                    console.log('hello');
                    // element.prepend('<tr><th id="par" class="span" colspan="5" scope="colgroup">Attribute</th></tr>');
                }
            };
        })
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
                        element.html('@' + scope.username + '');
                    // element.wrap('<h4></h4>');

                }
            };
        })
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
        })
        .directive('profileRow', function () {
            return {
                replace: true,
                restrict: 'E',
                scope: {
                    data: "=",
                    grouped: '=',
                    checkboxes: '@',
                    values: '@',
                    label: '@',
                    entityName: "=",
                    groupedParent: "@",
                    model: '=',
                    isChild: "=",
                    prefix: "@"
                },
                controller: function ($scope) {
                    //console.log($scope.parent);
                },
                templateUrl: 'templates/directives/profile--single-row.html',
                link: function (scope, element, attrs) {

                    // attrs.$observe('checkboxes', function() {

                    //     scope.checkboxes = scope.$eval(attrs.checkboxes);
                    // });

                }
            };
        })
        .directive('profileFetch', function () {
            return {
                restrict: 'E',
                scope: {
                    done: "&",
                    namespace: "@",
                    text: '@'
                },
                template: '<div class="right mini ui button trigger" ng-click="done({namespace:namespace})"><img src="/images/settings/{{namespace}}.png" class="micro">{{text}}</div>',
                link: function () {
                    //$('.ui.basic.modal')
                    ////;
                    //console.log( );
                    //if ($('.ui.basic.modal').length) {
                    //    $('.ui.basic.modal').modal('show');
                    //}
                }
            };
        })
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


});
