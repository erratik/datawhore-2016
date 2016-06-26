module.exports = function (app, tpl_folder) {
    app
    // todo: remove a network config (probably just move the schema to a trash bin)

        .directive('addNamespace', ['NetworkService', 'CoreService', function (NetworkService, CoreService) {
            return {
                restrict: 'E',
                templateUrl: tpl_folder + 'network--add.html',
                controller: function($scope) {
                    $scope.namespace = '';
                    $scope.type = '';
                    $scope.addNetwork = function() {

                        NetworkService.addNetwork($scope.namespace, $scope.type).then(function (data) {
                            CoreService.getNetworks({namespace: false}).then(function(networks){
                                //console.log($scope.$parent);
                                $scope.$parent.networks = networks;
                            });
                        });
                    };


                }
            };
        }])

        .directive('oauthParameters', ['NetworkService', function (NetworkService) {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    namespace: '=',
                    network: '=',
                    currentSettings: '='
                },
                controller: function ($scope) {

                    $scope.preset = true;
                    $scope.data = {};
                    $scope.data[$scope.namespace] = [];
                    $scope.showOauthParams = _.size($scope.currentSettings) >= 2 ? _.size($scope.currentSettings) : false;
                    //$scope.proposeConnect = _.size($scope.currentSettings) >= 2 ? true : true;
                    $scope.addSettings = false;

                    $scope.params = [
                        {
                            key: 'api_key',
                            label: 'API Key',
                            value: (typeof $scope.currentSettings != 'undefined' && typeof $scope.currentSettings.api_key != 'undefined') ? $scope.currentSettings.api_key.value : ''
                        },
                        {
                            key: 'api_secret',
                            label: 'API Secret',
                            value: (typeof $scope.currentSettings != 'undefined' && typeof $scope.currentSettings.api_secret != 'undefined') ? $scope.currentSettings.api_secret.value : ''

                        }
                    ];

                    _.each($scope.currentSettings, function (obj, key) {

                        if (_.first(_.filter($scope.params, {key: key})) === undefined) {
                            obj.key = key;
                            $scope.data[$scope.namespace].push(obj);
                        } else {
                            $scope.data[$scope.namespace].push(_.first(_.filter($scope.params, {key: key})));
                        }
                        $scope.params = _.reject($scope.params, {key: key});

                    });


                    //console.info($scope);

                    $scope.addNewChoice = function () {
                        $scope.data[$scope.namespace].push({});
                    };

                    $scope.removeChoice = function (key) {
                        $scope.data[$scope.namespace] = _.reject($scope.data[$scope.network], {key: key});
                    };


                    // Add/update or a network ----------------------------------*/
                    $scope.updateNetwork = function () {
                        NetworkService.updateNetwork($scope.namespace, {oauth: $scope.data[$scope.namespace]}).then(function (data) {
                            console.info(data);
                            $scope.currentSettings = data.settings.oauth;
                            $scope.addSettings = false;
                        });
                    };

                    // Add/update or a network ----------------------------------*/
                    $scope.connectNetwork = function () {
                        console.debug($scope.currentSettings);
                        NetworkService.connectNetwork($scope.namespace, $scope.currentSettings);
                    };

                    $scope.removeNetwork = function () {
                        NetworkService.removeNetwork($scope.namespace, $scope.currentSettings).then(function (data) {
                            console.info(data);
                        });
                    };

                    $scope.edit = function () {
                        $scope.addSettings = true;
                    };


                    //console.log($scope.$parent)

                },
                templateUrl: 'templates/directives/network--settings.html',//
                link: function (scope, el, attrs) {
                    var network = _.filter(scope.$parent.networks, {name: scope.network});

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
                    renameable: '=',
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
                    $scope.fn = function () {
                        $scope.fetch({namespace: $scope.namespace});
                    };
                },
                template: '<div class="right mini ui button trigger" ng-click="fn()"><img src="/images/settings/{{namespace}}.png" class="micro">{{text}}</div>'
            };
        });

};
