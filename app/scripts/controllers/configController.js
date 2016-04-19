define([
    './module'
], function (controllers) {
    'use strict';
    controllers
        .controller('networksController', ['$scope', '$http', '$log', 'CoreService', 'networks',
            function networksController($scope, $http, $log, CoreService, networks) {
                ////console.log($scope);

                $scope.networks = networks;
                //$scope.configs = configs;
                console.info($scope.networks);



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

                $scope.sortType = 'data.label';
                $scope.sortReverse = false;

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
                        $scope.formData.profileConfig = data.config;
                        $scope.formData.profileProperties = data.properties;
                    });
                };

                $scope.updateProperties = function (type) {
                    //console.log($scope.formData);
                    ProfileService.update($scope.profileInfo.name, $scope.formData[type + 'Properties'], type).then(function (data) {
                        //console.info(data);
                        $scope.formData[type + 'Properties'] = data;
                    });
                };


                // when submitting the add form, send the text to the node API
                $scope.cleanConfig = function (type) {
                    //$scope.show_modal = true;

                    ConfigService.cleanConfig({
                        namespace: $scope.profileInfo.name,
                        type: type
                    }).then(function (data) {
                        //console.info(data);
                        $scope.formData[type+'Config']= data.config;
                        $scope.formData[type+'Properties'] = data.properties;
                        console.info($scope.formData);

                        $scope.show_modal = false;
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


