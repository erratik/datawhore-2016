
define(['core/runners/logRunner'], function(logRunner){

    console.log('test');
    //
    angular.module('coreModule', [])
        .controller('configController', ['$scope', '$log', '$stateParams', 'ConfigService', function($scope, $log, $stateParams, ConfigService){
            console.log(angular);


            var loadSample = function(){
                return ConfigService.getConfig($stateParams.namespace);
            };

            loadSample().then(function(response){
                $scope.post = response;
            });

            $scope.title = 'Hello world!';
            $log.info($scope);

        }]);

    /*app.controller('configController', ['$scope', '$http',  '$stateParams', 'ConfigService', 'ProfileService', 'profile', 'config',
        function configController($scope, $http, $stateParams, ConfigService, ProfileService,  profile, config) {
            //console.log(profile.postProperties);

            //$scope.hidden = true;
            $scope.profileInfo = {
                avatar: profile.avatar,
                last_modified: profile.last_modified,
                name: profile.name,
                username: profile.username
            };

            $scope.formData = {
                profileConfig : config.profileConfig,
                postConfig : config.postConfig,
                profileProperties : profile.profileProperties,
                postProperties : profile.postProperties
            };

            var loadSample = function(){
                return ProfileService.getPosts( {namespace: $stateParams.namespace, count: 1}, true);
            };

            loadSample().then(function(response){
                $scope.post = response;
            });

            console.log($scope);

            // when submitting the add form, send the text to the node API
            //$scope.deleteProfile = function(namespace) {
            //    ////console.log(':: deleteProfile');
            //    $scope.ConfigService.delete(namespace).then(function(data){
            //        delete $scope.profile;
            //    });
            //};

            //
            //// when submitting the add form, send the text to the node API
            //$scope.getProfile = function(namespace) {
            //    ConfigService.getProfileConfig({namespace: $scope.profileInfo.name}).then(function(data){
            //        $scope.profileInfo = data.profileInfo;
            //    });
            //};

            $scope.updateConfig = function(configType) {
                ConfigService.update($scope.profileInfo.name, $scope.formData, configType).then(function(data){
                    $scope.profileInfo.last_modified = data.last_modified;
                    //console.log(data);
                    updatedConfigs(data);
                    //$scope.formData[configType+'Properties'] = data;
                });
            };

            $scope.updateProperties = function(configType) {
                //console.log($scope.formData);
                ProfileService.update($scope.profileInfo.name, $scope.formData[configType+'Config'], configType).then(function(data){
                    //$scope.profileInfo.last_modified = data.last_modified;
                    $scope.formData[configType+'Config'] = data;
                });
            };


            // when submitting the add form, send the text to the node API
            $scope.cleanConfig = function(configType) {
                //$scope.show_modal = true;
                ConfigService.cleanConfig({namespace: $scope.profileInfo.name, configType: configType}).then(function(data){
                    ////console.log('test');
                    updatedConfigs(data);
                    $scope.show_modal = false;
                });
            };
            // when submitting the add form, send the text to the node API
            $scope.cleanPost = function(namespace) {
                ConfigService.cleanPost({namespace: namespace}).then(function(data){
                    updatedConfigs(data);
                });
            };
            //
            $scope.createEntity = function(label) {
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

            $scope.close_modal = function(){
                $scope.show_modal = false;
            };

            $scope.open_modal = function(){
                $scope.show_modal = true;
            };

        }
    ]);*/
});
/*

// public/core.js
var app = angular.module('controllers.Config', [

    'directives.profileUpdated',
    'directives.profileRemove',
    'directives.profileUsername',
    'directives.profileAvatar',
    'directives.profileFetch',
    'directives.profileCard',
    'directives.profileRow',
    'tabs'
]);


app.controller('networksController', ['$scope', '$http', 'CoreService', 'networks', 'configs',
    function networksController($scope, $http, CoreService, networks, configs) {
        ////console.log($scope);

    $scope.networks = networks;
    $scope.configs = configs;
    //console.log($scope);

    // when submitting the add form, send the text to the node API
    //$scope.cleanProfile = function(namespace) {
    //    ConfigService.cleanProfile({namespace: namespace}).then(function(data){
    //        // $scope.profiles[namespace]
    //        //console.log(data);
    //    });
    //};

}]);




*/
