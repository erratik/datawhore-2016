define([
    './module'
], function (controllers) {
    'use strict';
    controllers
        .controller('networksController', ['$scope', '$http', '$log', 'CoreService', 'networks', 'configs',
            function networksController($scope, $http, $log, CoreService, networks, configs) {
                ////console.log($scope);

                $scope.networks = networks;
                $scope.configs = configs;
                $log.info($scope);

                // when submitting the add form, send the text to the node API
                //$scope.cleanProfile = function(namespace) {
                //    ConfigService.cleanProfile({namespace: namespace}).then(function(data){
                //        // $scope.profiles[namespace]
                //        //console.log(data);
                //    });
                //};

            }
        ])

        .controller('configController', ['$scope', '$http', '$stateParams', 'ConfigService', 'ProfileService', 'profile', 'config',
            function configController($scope, $http, $stateParams, ConfigService, ProfileService, profile, config) {
                $scope.profileInfo = {
                    avatar: profile.avatar,
                    last_modified: profile.last_modified,
                    name: profile.name,
                    username: profile.username
                };

                $scope.formData = {
                    profileConfig: config.profileConfig,
                    postConfig: config.postConfig,
                    profileProperties: profile.profileProperties,
                    postProperties: profile.postProperties
                };

                var loadSample = function () {
                    return ProfileService.getPosts({namespace: $stateParams.namespace, count: 1}, true);
                };

                loadSample().then(function (response) {
                    $scope.post = response;
                });

                console.log($scope);

                $scope.updateConfig = function (type) {
                    var config =  $scope.formData[type+'Config'];
                    ConfigService.update($scope.profileInfo.name, type, config).then(function (data) {
                        //$scope.profileInfo.last_modified = data.last_modified;
                        console.log(data);
                        //updatedConfigs(data);
                        //$scope.formData[configType+'Properties'] = data;
                    });
                };

                $scope.updateProperties = function (configType) {
                    //console.log($scope.formData);
                    ProfileService.update($scope.profileInfo.name, $scope.formData[configType + 'Config'], configType).then(function (data) {
                        //$scope.profileInfo.last_modified = data.last_modified;
                        $scope.formData[configType + 'Config'] = data;
                    });
                };


                // when submitting the add form, send the text to the node API
                $scope.cleanConfig = function (configType) {
                    //$scope.show_modal = true;

                    ConfigService.cleanConfig({
                        namespace: $scope.profileInfo.name,
                        type: configType
                    }).then(function (data) {
                        //console.info(data);
                        $scope.formData.profileConfig = data;
                        //$scope.show_modal = false;
                    });
                };
                // when submitting the add form, send the text to the node API
                $scope.cleanPost = function (namespace) {
                    ConfigService.cleanPost({namespace: namespace}).then(function (data) {
                        updatedConfigs(data);
                    });
                };
                //
                $scope.createEntity = function (label) {
                    //console.log('createEntity?');
                    //console.log(label);
                };

                function updatedConfigs(data) {
                    $scope.formData.profileConfig = data.profileConfig;
                    $scope.formData.postConfig = data.postConfig;
                    $scope.formData.profileProperties = data.profileProperties;
                    $scope.formData.postProperties = data.postProperties;
                    ////console.log(data.profileProperties);

                }

                $scope.show_modal = false;

                $scope.close_modal = function () {
                    $scope.show_modal = false;
                };

                $scope.open_modal = function () {
                    $scope.show_modal = true;
                };

            }
        ]);

});


