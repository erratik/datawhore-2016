module.exports = function (app, tpl_folder) {
    app
        .directive('profileAvatar', function () {
            return {
                restrict: 'E',
                scope: {
                    namespace: "=",
                    profile: "=",
                    classes: "@"
                },
                templateUrl: tpl_folder + 'profile--avatar.html'
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
                templateUrl: tpl_folder + 'profile--card.html',
                link: function (scope, element, attrs) {
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
        .directive('profileUpdated', ['moment', function (moment) {
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
        }])
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
                    entityName: "@",
                    groupedParent: "@",
                    model: '=',
                    isChild: "=",
                    prefix: "@"
                },
                controller: function ($scope) {
                    //console.log($scope.parent);
                },
                templateUrl: tpl_folder + '/profile--single-row.html',
                link: function (scope, element, attrs) {
                    if (typeof scope.entityName == 'string') {
                        //console.log(scope.entityName);
                        //scope.label = scope.entityName;
                    }
                    // attrs.$observe('checkboxes', function() {

                    //     scope.checkboxes = scope.$eval(attrs.checkboxes);
                    // });

                }
            };
        })
        .directive('configFetch', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    fetch: "&",
                    namespace: "@",
                    text: '@'
                },
                controller: function ($scope) {
                    $scope.fn = function() {
                        $scope.fetch({namespace: $scope.namespace});
                    };
                },
                template: '<div class="right mini ui button trigger" ng-click="fn()"><img src="/images/settings/{{namespace}}.png" class="micro">{{text}}</div>',
                link: function (scope, elem, attrs) {

                    //console.info(elem);
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


};
