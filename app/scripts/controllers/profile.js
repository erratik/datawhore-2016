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
    function ($scope, $stateParams, $http ) {

    $scope.model = {
        network: $stateParams.namespace
    };

    $scope.formData = {};

    // when landing on the page, get all profiles and show them
    $http.get('/api/profiles', $scope.model.network)
        .success(function(data) {
            $scope.model.configs = data.configs;

            console.log(data.profiles[$stateParams.namespace].props);

            // $scope.formData[$stateParams.namespace] = {};
            var profileValues = Object.keys(data.profiles[$stateParams.namespace].profile);

            for (var j = 0; j < profileValues.length; j++) {

                $scope.formData[profileValues[j]] = {};
                var savedValue = data.profiles[$stateParams.namespace].profile[profileValues[j]];

                if (typeof savedValue == 'object' && savedValue != null) {
                    console.log('--- object manipulation');  
                    var subValues = Object.keys(savedValue);  
                    console.log(subValues);

                    for (var i = 0; i < subValues.length; i++) {

                        if (data.profiles[$stateParams.namespace].props[profileValues[j]]) {

                            $scope.formData[profileValues[j]][subValues[i]] = {
                                // value: (typeof savedValue == 'object') ? JSON.stringify(savedValue): savedValue,
                                // type: typeof savedValue
                                value: data.profiles[$stateParams.namespace].props[profileValues[j]][subValues[i]].value,
                                enabled: data.profiles[$stateParams.namespace].props[profileValues[j]][subValues[i]].enabled      
                            }                  
                            console.log($scope.formData[profileValues[j]]);
                        }

                    };

                } else {
                    $scope.formData[profileValues[j]] = {
                        // value: (typeof savedValue == 'object') ? JSON.stringify(savedValue): savedValue,
                        // type: typeof savedValue
                        value: savedValue
                    };

                }

            }

            if (typeof data.profiles[$stateParams.namespace].props != 'undefined') {

                var profileProps = Object.keys(data.profiles[$stateParams.namespace].props);
                // console.log(data)
                for (var i = 0; i < profileProps.length; i++) {
                    if (typeof $scope.formData[profileProps[i]] != 'undefined') {
                        $scope.formData[profileProps[i]].displayName = data.profiles[$stateParams.namespace].props[profileProps[i]].displayName;
                        $scope.formData[profileProps[i]].enabled = true;


                    }

                }


            } 
            $scope.hidden = true;
            $scope.model.profiles = data.profiles;
            console.log($scope.formData)

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    $scope.updateProfileProps = function(namespace) {
        console.log('updateProfileProps');

        var properties = Object.keys($scope.formData)
        console.log('2test');
        for (var i = 0; i < properties.length; i++) {
            console.log(typeof $scope.formData[properties[i]]);
            if (!$scope.formData[properties[i]].enabled) delete $scope.formData[properties[i]];
        };
        // post goes to each network's api routes js
        console.log('test');
        console.log($scope.formData);

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


