// public/core.js
var app = angular.module('controllers.Profiles', [

    'directives.profileUpdated', 
    'directives.profileRemove', 
    'directives.profileUsername',
    'directives.profileAvatar',
    'directives.profileFetch',
    'directives.profileCard',
    'directives.profileRow'
]);


app.controller('profilesController', ['$scope', '$http', 'ProfileService', 'configs', 'profiles', function profilesController($scope, $http, ProfileService, configs, profiles) {

    $scope.configs = configs;
    $scope.profiles = profiles;

    // when submitting the add form, send the text to the node API
    $scope.cleanProfile = function(namespace) {
        //console.log('cleanProfile');
        ProfileService.cleanProfile({namespace: namespace}).then(function(data){
            // $scope.profiles[namespace]
            console.log(data);
        });
    };

}]);

app.controller('profileController', ['$scope', '$http',  '$stateParams', 'ProfileService', 'profile', 'config',
    function profileController($scope, $http, $stateParams, ProfileService, profile, config) {
        // Setting up the scope's data -------------------------------------------------------*/


        $scope.hidden = true;
        $scope.formData = {};
        $scope.formData.profileConfig = profile.profileConfig;
        $scope.formData.postConfig = profile.postConfig;
        $scope.profileInfo = profile.profileInfo;

        // $scope.profileData = config;
        $scope.formData.profileProperties = config;
        console.log($scope);


        // when submitting the add form, send the text to the node API
        $scope.deleteProfile = function(namespace) {
            //console.log(':: deleteProfile');
            $scope.ProfileService.delete(namespace).then(function(data){
                delete $scope.profile;
                $scope.config = data;
            });
        };

        // when submitting the add form, send the text to the node API
        $scope.getProfile = function(namespace) {
            ProfileService.getProfile({namespace: $scope.profileInfo.name}).then(function(data){
                $scope.profileInfo = data.profileInfo;
            });
        };
           
        $scope.updateProfile = function(namespace) {
            ProfileService.update($scope.profileInfo.name, $scope.formData).then(function(data){
                $scope.profileInfo.last_modified = data.last_modified;
                updatedConfigs(data);
            });
        
        };

        // when submitting the add form, send the text to the node API
        $scope.cleanProfile = function(namespace) {
            ProfileService.cleanProfile({namespace: namespace}).then(function(data){
                updatedConfigs(data);
            });
        };

        function updatedConfigs(data) {
            $scope.formData.profileConfig = data.profileConfig;
            $scope.formData.postConfig = data.postConfig;
            $scope.formData.profileProperties = data.profileProperties;
            //console.log(data.profileProperties);
            
        }

        $scope.watchAttribute = function(attrPath) {


        };

    }
]);


