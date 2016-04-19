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
                template: '<div class="ui negative mini button negative"><i class="exchange icon"></i></div>',
                link: function (scope, element, attrs) {
                    element.on('click', function () {
                        scope.disconnectNetwork(scope.network.namespace);
                    });
                }
            };
        })
        .directive('connectNamespace', function () {
            return {
                restrict: 'E',
                scope: {
                    connect: "&",
                    classes: '@',
                    namespace: '='
                },
                controller: function ($scope) {
                    $scope.fn = function () {
                        $scope.connect({namespace: $scope.namespace});
                    };
                },
                template: '<button class="{{classes}}" ng-click="fn()"><i class="exchange icon"></i></button>',
                link: function (scope, element, attrs) {
                    element.on('click', function () {
                        scope.connectNetwork(scope.namespace);
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
                        scope.configureNetwork(scope.network.name);
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
        .directive('oauthParameters', ['CoreService', function (CoreService) {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    network: '=',
                    currentSettings: '='
                },
                controller: function ($scope) {

                    $scope.preset = true;
                    $scope.data = {};
                    $scope.data[$scope.network] = [];
                    $scope.params = [
                        {
                            key: 'api_key',
                            label: 'API Key',
                            value: (typeof $scope.currentSettings != 'undefined' && typeof $scope.currentSettings['api_key'] != 'undefined') ? $scope.currentSettings['api_key'].value : ''
                        },
                        {
                            key: 'api_secret',
                            label: 'API Secret',
                            value: (typeof $scope.currentSettings != 'undefined' && typeof $scope.currentSettings['api_secret'] != 'undefined') ? $scope.currentSettings['api_secret'].value : ''

                        }
                    ];

                    _.each($scope.currentSettings, function (obj, key) {

                        if (_.first(_.filter($scope.params, {key: key})) == undefined) {
                            obj.key = key;
                            $scope.data[$scope.network].push(obj);
                        } else {
                            $scope.data[$scope.network].push(_.first(_.filter($scope.params, {key: key})));
                        }

                        $scope.params = _.reject($scope.params, {key: key});

                    });
                    //console.log($scope.currentSettings);
                    console.log($scope.params);

                    $scope.addSettings = $scope.params.length ? true : false;
                    $scope.proposeConnect = !$scope.params.length ? true : false;


                    $scope.addNewChoice = function () {
                        $scope.data[$scope.network].push({});
                    };

                    $scope.removeChoice = function (key) {

                        $scope.data[$scope.network] = _.reject($scope.data[$scope.network], {key: key});

                    };

                    console.info($scope);

                    // Add/update or a network ----------------------------------*/
                    $scope.updateNetwork = function () {
                        //var settings = _.merge( $scope.data[$scope.network], $scope.currentSettings);
                        console.info($scope.currentSettings);
                        console.info($scope.data[$scope.network]);
                        //console.info(settings);
                        CoreService.updateNetwork($scope.network, {oauth: $scope.data[$scope.network]}).then(function (data) {
                            console.info(data);
                            //$scope.formData.profileConfig = data.config;
                            //$scope.formData.profileProperties = data.properties;
                        });
                    };

                },
                templateUrl: tpl_folder + 'network--settings.html',//
                link: function (scope, el, attrs) {
                    var network = _.filter(scope.$parent.networks, {name: scope.network});

                }
            };
        }])

});
