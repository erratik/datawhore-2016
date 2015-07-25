// public/core.js

var app = angular.module('controllers.Profile', [
        'angularMoment', 

        'directives.profileUpdated',
        'directives.profileRemove',
        'directives.profileFetch',
        'directives.profileAvatar',
        'directives.propertyValues'

    ]);

app.controller('profileController', ['$scope','$stateParams', '$http', 
    function profileController($scope, $stateParams, $http ) {

    $scope.model = {
        network: $stateParams.namespace
    };

    $scope.formData = {};

    // when landing on the page, get all profiles and show them
    $http.get('/api/profiles', $scope.model.network)
        .success(function(data) {
            $scope.model.configs = data.configs;
            $scope.formData[$stateParams.namespace] = {};
            var profileValues = Object.keys(data.profiles[$stateParams.namespace].profile);

            for (var i = 0; i < profileValues.length; i++) {

                var savedValue = data.profiles[$stateParams.namespace].profile[profileValues[i]];

                $scope.formData[profileValues[i]] = {
                    // value: (typeof savedValue == 'object') ? JSON.stringify(savedValue): savedValue,
                    // type: typeof savedValue
                    value: savedValue
                };


                // $scope.formData[profileProps[i]].value = data.profiles[$stateParams.namespace].profile[profileProps[i]];
            };
            if (typeof data.profiles[$stateParams.namespace].props != 'undefined') {

                var profileProps = Object.keys(data.profiles[$stateParams.namespace].props);
                // console.log(data)
                for (var i = 0; i < profileProps.length; i++) {
                    $scope.formData[profileProps[i]].displayName = data.profiles[$stateParams.namespace].props[profileProps[i]].displayName;
                    $scope.formData[profileProps[i]].enabled = true;
                };

            } 
            // console.log(profileValues)

            $scope.model.profiles = data.profiles;
            console.log($scope);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    $scope.updateProfileProps = function(namespace) {
        console.log('updateProfileProps');
        // post goes to each network's api routes js

        $http.post('/api/profile/props/'+namespace, $scope.formData)
            .success(function(data) {
                // console.log(data);
                $scope.model.profiles[namespace] = data;
                // $scope.model.profiles = data.profiles;
                console.log($scope.model.profiles[namespace]);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };



}]);


