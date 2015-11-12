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
    // console.log(profiles);
    $scope.configs = configs;
    $scope.profiles = profiles;
    // $scope.ProfileService = angular.copy(ProfileService);

    // // $scope.profiles.load();
    // $scope.ProfileService.load().then(function(items){
    //    $scope.model = items;
    //    $scope.formData = items.formData;
    //         console.log($scope);
    //         init();
    // });

    console.log($scope);

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
app.controller('profileController', ['$scope', '$http',  '$stateParams', 'ProfileService', 'profileData', 'postData', 
    function profileController($scope, $http, $stateParams, ProfileService, profileData, postData) {
        // Setting up the scope's data -------------------------------------------------------*/


        $scope.hidden = true;

        $scope.formData = {};
        $scope.formData.postConfig = profileData.postConfig;
        $scope.formData.profileConfig = profileData.profileConfig;

        $scope.profileInfo = profileData.profileInfo;
        $scope.postData = postData;

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
            // console.log($scope.profileInfo.name)
            ProfileService.update($scope.profileInfo.name, $scope.formData).then(function(data){
                // profileData = 
                // console.log(data);
                $scope.profileInfo.last_modified = data.last_modified;
            });
        
        };

    }
]);


// app.controller('facebookProfileController', ['$scope', '$http',  '$stateParams', 'ProfileService', 'FacebookService', 
//     function facebookProfileController($scope, $http, $stateParams, ProfileService, FacebookService) {

//         $scope.FacebookService = angular.copy(FacebookService);

//         $scope.FacebookService.getPosts().then(function(data){
//             // $scope.hidden = true;
//             // $scope.profile. = data.profile;
//             // $scope.config = data.config;
//             // $scope.formData = data.formData;
//             console.log(data);
//         });

//     }
// ]);

