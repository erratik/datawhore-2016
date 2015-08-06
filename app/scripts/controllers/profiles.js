// public/core.js
var app = angular.module('controllers.Profiles', [
    'angularMoment', 
    'directives.jqueryDirectives', 
    'directives.profileUpdated', 
    'directives.profileRemove', 
    'directives.profileUsername',
    'directives.profileAvatar',
    'directives.profileFetch'
]);



app.service('ProfileService', function ($http, $q){
    var ProfileService = {};

    ProfileService.load = function(namespace){   
        namespace = typeof namespace !== 'undefined' ? namespace : false;   
        if (namespace) {

            return $http.get('/api/profile/'+namespace).
            then(function(response) {
                var data = response.data;
                data.formData = {};
                var profileValues = Object.keys(data.profile.fetchedProfile);
                for (var j = 0; j < profileValues.length; j++) {
                    data.formData[profileValues[j]] = {};
                    var savedValue = data.profile.fetchedProfile[profileValues[j]];
                    data.formData[profileValues[j]] = {
                        value: savedValue
                    };
                }
                if (typeof data.profile.props != 'undefined') {
                    var profileProps = Object.keys(data.profile.props);
                    for (var i = 0; i < profileProps.length; i++) {
                        if (typeof data.formData[profileProps[i]] != 'undefined') {
                            data.formData[profileProps[i]].displayName = data.profile.props[profileProps[i]].displayName;
                            data.formData[profileProps[i]].enabled = true;
                        }
                    }
                }

                return (data);
            });  
        } else {
            return $http.get('/api/profiles').
            then(function(response) {

                return (response.data);
            });         

        }      
    }

    // FETCHING A NEW PROFILE FROM THE NETWORK
    ProfileService.update = function(namespace){            
        return $http.post('/api/profiles/' + namespace).
        then(function(response) {
            return (response.data);
        });            
    }
    ProfileService.delete = function(namespace){            
        return $http.delete('/api/profiles/' + namespace).
        then(function(response) {
            // console.log(response.data); //I get the correct items, all seems ok here
            return (response.data);
            // console.log(profileService);
        });            
    }

    return ProfileService;
});

app.controller('profilesController', ['$scope', '$http', 'ProfileService', function profilesController($scope, $http, ProfileService) {
    // console.log(this);

    $scope.ProfileService = angular.copy(ProfileService);

    // $scope.profiles.load();
    $scope.ProfileService.load().then(function(items){
       $scope.model = items;
            console.log($scope.model);
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
            // console.log(':: updateProfileProps');
            // console.log($scope.formData);
            var properties = Object.keys($scope.formData)
            // console.log(':: updateProfileProps > properties');
            for (var i = 0; i < properties.length; i++) {
                // console.log($scope.formData[properties[i]]);
                if (!$scope.formData[properties[i]].enabled == 'off') delete $scope.formData[properties[i]];
            };

            $http.post('/api/profile/props/' + namespace, $scope.formData).success(function(data) {
                console.log(data);
                $scope.profile = data;
            }).error(function(data) {
                console.log('Error: ' + data);
            });
        };

    }
]);
