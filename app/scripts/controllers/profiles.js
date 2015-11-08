// public/core.js
var app = angular.module('controllers.Profiles', [
    'angularMoment', 

    'directives.profileUpdated', 
    // 'directives.profileUpdate', 
    'directives.profileRemove', 
    'directives.profileUsername',
    'directives.profileAvatar',
    'directives.profileFetch'
]);




app.controller('profilesController', ['$scope', '$http', 'ProfileService', function profilesController($scope, $http, ProfileService) {
    // console.log(this);

    $scope.ProfileService = angular.copy(ProfileService);

    // $scope.profiles.load();
    $scope.ProfileService.load().then(function(items){
       $scope.model = items;
       $scope.formData = items.formData;
            console.log($scope);
            init();
    });

    // when submitting the add form, send the text to the node API
    $scope.getProfile = function(namespace) {
        // $scope.model = fetchProfile.getobject(namespace);
        $scope.ProfileService.update(namespace).then(function(items){
            $scope.model.profiles[namespace] = items.profile;
            $scope.model.configs[namespace] = items.config;
        });
    };

    $scope.updateProfileProps = function(namespace) {
        $scope.ProfileService.updateProps(namespace, false, $scope.formData[namespace]).then(function(profile){
            // console.log(profile);
            $scope.model.profiles[namespace] = profile;
            // $scope.edit[namespace]=!$scope.edit[namespace];
        });
    };

}]);
app.controller('profileController', ['$scope', '$http',  '$stateParams', 'ProfileService', function profilesController($scope, $http, $stateParams, ProfileService) {
        // Setting up the scope's data -------------------------------------------------------*/
        $scope.network = $stateParams.namespace;
        $scope.ProfileService = angular.copy(ProfileService);
        $scope.formData = {};

        $scope.ProfileService.load($scope.network).then(function(data){
            $scope.hidden = true;
            $scope.profile = data.profile;
            $scope.config = data.config;
            $scope.formData = data.formData;
            //console.log($scope.formData);
        });

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
            //console.log(':: getProfile');
            // $scope.model = fetchProfile.getobject(namespace);
            $scope.ProfileService.update(namespace).then(function(data){
                $scope.profile = data.profile;
                $scope.config = data.config;
            });
        };

           
        $scope.updateProfileProps = function(namespace) {
            $scope.ProfileService.updateProps(namespace, true, $scope.formData).then(function(profile){
                // $scope.model.profiles[namespace] = items.profile;
                // $scope.model.configs[namespace] = items.config;
                console.log(profile);
                $scope.profile = profile;
            });
        
        };

    }
]);
