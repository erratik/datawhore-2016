// public/core.js
var app = angular.module('controllers.Config', [

    'directives.profileUpdated', 
    'directives.profileRemove', 
    'directives.profileUsername',
    'directives.profileAvatar',
    'directives.profileFetch',
    'directives.profileCard',
    'directives.profileRow'
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


app.controller('configController', ['$scope', '$http',  '$stateParams', 'ConfigService', 'ProfileService', 'profile', 'config',
    function configController($scope, $http, $stateParams, ConfigService, ProfileService,  profile, config) {
        //console.log(profile);

        $scope.hidden = true;
        $scope.profileInfo = config.profileInfo;
        $scope.formData = {};
        $scope.formData.profileConfig = config.profileConfig;
        $scope.formData.postConfig = config.postConfig;
        $scope.formData.profileProperties = profile.profileProperties;
        $scope.formData.postProperties = profile.postProperties;

        console.log($scope);

        // when submitting the add form, send the text to the node API
        $scope.deleteProfile = function(namespace) {
            //console.log(':: deleteProfile');
            $scope.ConfigService.delete(namespace).then(function(data){
                delete $scope.profile;
            });
        };

        // when submitting the add form, send the text to the node API
        $scope.getProfile = function(namespace) {
            ConfigService.getProfileConfig({namespace: $scope.profileInfo.name}).then(function(data){
                $scope.profileInfo = data.profileInfo;
            });
        };
           
        $scope.updateProfile = function() {
            ConfigService.update($scope.profileInfo.name, $scope.formData).then(function(data){
                $scope.profileInfo.last_modified = data.last_modified;
                updatedConfigs(data);
            });
        };

        $scope.updateProperties = function(configType) {
            ProfileService.update($scope.profileInfo.name, $scope.formData, configType).then(function(data){
                //$scope.profileInfo.last_modified = data.last_modified;

                $scope.formData[configType+'Properties'] = data;
            });
        };
        //
        //$scope.updatePostProperties = function() {
        //    ProfileService.update($scope.profileInfo.name, $scope.formData).then(function(data){
        //        //$scope.profileInfo.last_modified = data.last_modified;
        //
        //        $scope.formData.postProperties = data;
        //    });
        //};

        // when submitting the add form, send the text to the node API
        $scope.cleanConfig = function(configType) {
            ConfigService.cleanConfig({namespace: $scope.profileInfo.name, configType: configType}).then(function(data){
                //console.log(data);
                updatedConfigs(data);

            });
        };
        // when submitting the add form, send the text to the node API
        $scope.cleanPost = function(namespace) {
            ConfigService.cleanPost({namespace: namespace}).then(function(data){
                updatedConfigs(data);
            });
        };

        function updatedConfigs(data) {
            $scope.formData.profileConfig = data.profileConfig;
            $scope.formData.postConfig = data.postConfig;
            $scope.formData.profileProperties = data.profileProperties;
            $scope.formData.postProperties = data.postProperties;
            //console.log(data.profileProperties);
            
        }


    }
]);


