// public/core.js

var app = angular.module('controllers.Profiles', [
        'angularMoment', 

        'directives.profileUpdated',
        'directives.profileAvatar'

    ]);

app.controller('profilesController', ['$scope', '$http', function profilesController($scope, $http) {

    $scope.formData = {};

    // when landing on the page, get all settings and show them
    $http.get('/api/profiles')
        .success(function(data) {
            console.log(data);
            $scope.configs = data.configs;
            $scope.networks = data.networks;
            $scope.profiles = data.profiles;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.getProfile = function(namespace) {
        // post goes to each network's api routes js
        $scope[namespace] = {};
        $http.post('/api/profiles/'+namespace)
            .success(function(data) {

                $scope.profiles[namespace] = {
                    profile : data,
                    last_modified : Date.now() / 1000 | 0
                };
                console.log($scope);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a setting after checking it
    $scope.deleteSettings = function() {
        $http.delete('/api/settings/', $scope.settings)
            .success(function(data) {
                $scope.settings = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


}])