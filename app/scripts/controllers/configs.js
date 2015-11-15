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


app.controller('configsController', ['$scope', '$http', 'ConfigService', 'configs', 'profiles', 
    function configsController($scope, $http, ConfigService, configs, profiles) {

    $scope.configs = configs;
    $scope.profiles = profiles;

    // when submitting the add form, send the text to the node API
    $scope.cleanProfile = function(namespace) {
        ConfigService.cleanProfile({namespace: namespace}).then(function(data){
            // $scope.profiles[namespace]
            console.log(data);
        });
    };

}]);


app.controller('configController', ['$scope', '$http',  '$stateParams', 'ConfigService', 'profile', 'config',
    function configController($scope, $http, $stateParams, ConfigService, profile, config) {

        $scope.hidden = true;
        $scope.profileInfo = profile.profileInfo;
        $scope.formData = {};
        $scope.formData.profileConfig = profile.profileConfig;
        $scope.formData.postConfig = profile.postConfig;
        $scope.formData.profileProperties = config;

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
            ConfigService.getProfile({namespace: $scope.profileInfo.name}).then(function(data){
                $scope.profileInfo = data.profileInfo;
            });
        };
           
        $scope.updateProfile = function(namespace) {
            ConfigService.update($scope.profileInfo.name, $scope.formData).then(function(data){
                $scope.profileInfo.last_modified = data.last_modified;
                updatedConfigs(data);
            });
        
        };

        // when submitting the add form, send the text to the node API
        $scope.cleanProfile = function(namespace) {
            ConfigService.cleanProfile({namespace: namespace}).then(function(data){
                updatedConfigs(data);
            });
        };

        function updatedConfigs(data) {
            $scope.formData.profileConfig = data.profileConfig;
            $scope.formData.postConfig = data.postConfig;
            $scope.formData.profileProperties = data.profileProperties;
            //console.log(data.profileProperties);
            
        }


    }
]);


