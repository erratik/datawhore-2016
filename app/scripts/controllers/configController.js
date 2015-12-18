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
        //console.log($scope);

    $scope.networks = networks;
    $scope.configs = configs;
    console.log($scope);
    // when submitting the add form, send the text to the node API
    //$scope.cleanProfile = function(namespace) {
    //    ConfigService.cleanProfile({namespace: namespace}).then(function(data){
    //        // $scope.profiles[namespace]
    //        console.log(data);
    //    });
    //};

}]);


app.controller('configController', ['$scope', '$http',  '$stateParams', 'ConfigService', 'ProfileService', 'profile', 'config', 'sample',
    function configController($scope, $http, $stateParams, ConfigService, ProfileService,  profile, config, sample) {
        //console.log(profile);

        //$scope.hidden = true;
        $scope.profileInfo = config.profileInfo;

        $scope.formData = {
            profileConfig : config.profileConfig,
            postConfig : config.postConfig,
            profileProperties : profile.profileProperties,
            postProperties : profile.postProperties
        };

        $scope.post = sample;

        console.log($scope);

        // when submitting the add form, send the text to the node API
        //$scope.deleteProfile = function(namespace) {
        //    //console.log(':: deleteProfile');
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
                console.log(data);
                updatedConfigs(data);
                //$scope.formData[configType+'Properties'] = data;
            });
        };

        $scope.updateProperties = function(configType) {
            ProfileService.update($scope.profileInfo.name, $scope.formData[configType+'Properties'], configType).then(function(data){
                //$scope.profileInfo.last_modified = data.last_modified;
                $scope.formData[configType+'Properties'] = data;
            });
        };


        // when submitting the add form, send the text to the node API
        $scope.cleanConfig = function(configType) {
            //$scope.show_modal = true;
            ConfigService.cleanConfig({namespace: $scope.profileInfo.name, configType: configType}).then(function(data){
                //console.log('test');
                updatedConfigs(data);

            });
        };
        // when submitting the add form, send the text to the node API
        $scope.cleanPost = function(namespace) {
            ConfigService.cleanPost({namespace: namespace}).then(function(data){
                updatedConfigs(data);
            });
        };
        // when submitting the add form, send the text to the node API
        $scope.createEntity = function(label) {
            console.log('createEntity?');
            console.log(label);
        };

        function updatedConfigs(data) {
            $scope.formData.profileConfig = data.profileConfig;
            $scope.formData.postConfig = data.postConfig;
            $scope.formData.profileProperties = data.profileProperties;
            $scope.formData.postProperties = data.postProperties;
            //console.log(data.profileProperties);

        }

        $scope.show_modal = false;

        $scope.close_modal = function(){
            $scope.show_modal = false;
        };

        $scope.open_modal = function(){
            $scope.show_modal = true;
        };

    }
]);


