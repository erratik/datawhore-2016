module.exports = function (app) {
    app
        .controller('profilesController', ['$scope', '$http', 'ProfileService', 'configs', 'profiles', function profilesController($scope, $http, ProfileService, configs, profiles) {

        $scope.configs = configs;
        $scope.profiles = profiles;

        // when submitting the add form, send the text to the node API
        //$scope.cleanProfile = function(namespace) {
        //    //console.log('cleanProfile');
        //    ProfileService.cleanProfile({namespace: namespace}).then(function(data){
        //        // $scope.profiles[namespace]
        //        console.log(data);
        //    });
        //};

        }])
        .controller('profileController', ['$scope', '$http', '$stateParams', 'ProfileService', 'profile', 'config',
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


            }
        ]);

};