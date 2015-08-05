// public/core.js
var app = angular.module('controllers.Profiles', [
    'angularMoment', 
    'directives.profileUpdated', 
    'directives.profileRemove', 
    'directives.profileUsername',
    'directives.profileAvatar',
    'directives.profileFetch'
]);



app.factory('profiles', function ($rootScope, $http, $q){
    var factory = {};
    console.log($rootScope);

    factory.load = function(namespace){   
        namespace = typeof namespace !== 'undefined' ? namespace : false;   
        if (namespace) {

            return $http.get('/api/profile/'+namespace).
            then(function(response) {
                var data = response.data;
                console.log(data)
                data.formData = {};
                var profileValues = Object.keys(data.profile.fetchedProfile);
                for (var j = 0; j < profileValues.length; j++) {
                    data.formData[profileValues[j]] = {};
                    var savedValue = data.profile.fetchedProfile[profileValues[j]];
                    data.formData[profileValues[j]] = {
                        value: savedValue
                    };
                }
                if (typeof data.props != 'undefined') {
                    var profileProps = Object.keys(data.props);
                    console.log(data.props)
                    for (var i = 0; i < profileProps.length; i++) {
                        if (typeof data.formData[profileProps[i]] != 'undefined') {
                            data.formData[profileProps[i]].displayName = data.props[profileProps[i]].displayName;
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
    factory.update = function(namespace){            
        return $http.post('/api/profiles/' + namespace).
        then(function(response) {
            return (response.data);
        });            
    }
    factory.delete = function(namespace){            
        return $http.delete('/api/profiles/' + namespace).
        then(function(response) {
            // console.log(response.data); //I get the correct items, all seems ok here
            return (response.data);
            // console.log(factory);
        });            
    }

    return factory;
});

app.controller('profilesController', ['$scope', '$http', 'profiles', function profilesController($scope, $http, profiles) {
    // console.log(this);

    $scope.profiles = angular.copy(profiles);

    // $scope.profiles.load();
    $scope.profiles.load().then(function(items){
       $scope.model = items;
            console.log($scope.model);
    });

    // when submitting the add form, send the text to the node API
    $scope.getProfile = function(namespace) {
        // $scope.model = fetchProfile.getobject(namespace);
        $scope.profiles.update(namespace).then(function(items){
            $scope.model.profiles[namespace] = items.profile;
            $scope.model.configs[namespace] = items.config;
        });
    };

}]);
app.controller('profileController', ['$scope', '$http',  '$stateParams', 'profiles', function profilesController($scope, $http, $stateParams, profiles) {
        $scope.network = $stateParams.namespace;
        $scope.profiles = angular.copy(profiles);
        $scope.formData = {};

        // when landing on the page, get all profiles and show them
        // $http.get('/api/profile/' + $scope.network).success(function(data) {
        //     // $scope.formData[$stateParams.namespace] = {};
        //     var profileValues = Object.keys(data.profile.fetchedProfile);
        //     for (var j = 0; j < profileValues.length; j++) {
        //         $scope.formData[profileValues[j]] = {};
        //         var savedValue = data.profile.fetchedProfile[profileValues[j]];
        //         $scope.formData[profileValues[j]] = {
        //             value: savedValue
        //         };
        //     }
        //     if (typeof data.props != 'undefined') {
        //         var profileProps = Object.keys(data.props);
        //         // console.log(data)
        //         for (var i = 0; i < profileProps.length; i++) {
        //             if (typeof $scope.formData[profileProps[i]] != 'undefined') {
        //                 $scope.formData[profileProps[i]].displayName = data.props[profileProps[i]].displayName;
        //                 $scope.formData[profileProps[i]].enabled = true;
        //             }
        //         }
        //     }
        //     $scope.hidden = true;
        //     $scope.profile = data.profile;
        //     $scope.config = data.config;
        //     console.log($scope);
        // }).error(function(data) {
        //     console.log('Error: ' + data);
        // });

        $scope.profiles.load($scope.network).then(function(data){

            $scope.hidden = true;
            $scope.profile = data.profile;
            $scope.config = data.config;
            $scope.formData = data.formData;

            // console.log($scope);
        });

        $scope.updateProfileProps = function(namespace) {
            console.log('updateProfileProps');
            var properties = Object.keys($scope.formData)

            for (var i = 0; i < properties.length; i++) {
                if (!$scope.formData[properties[i]].enabled) delete $scope.formData[properties[i]];

            };

            $http.post('/api/profile/props/' + namespace, $scope.formData).success(function(data) {
                console.log(data);
                $scope.profile = data;

            }).error(function(data) {
                console.log('Error: ' + data);
            });
        };

        // when submitting the add form, send the text to the node API
        $scope.deleteProfile = function(namespace) {
            $scope.profiles.delete(namespace).then(function(data){
                delete $scope.profile;
                $scope.config = data;
            });
        };

        // when submitting the add form, send the text to the node API
        $scope.getProfile = function(namespace) {
            // $scope.model = fetchProfile.getobject(namespace);
            $scope.profiles.update(namespace).then(function(data){
                $scope.profile = data.profile;
                $scope.config = data.config;
            });
        };

    }
]);
