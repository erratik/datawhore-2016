define([
    './module', 'lodash'
], function (controllers) {
    'use strict';

    controllers
        .controller('coreController', ['$scope', '$http',  'CoreService', 'networks',
            function coreController($scope, $http, CoreService, networks) {

                $scope.networks = networks;
                $scope.networkCount = _.size(networks);
                console.info($scope);


                $scope.deleteNetworkNamespace = function (namespace) {
                    console.log(namespace);
                    $http.delete('/api/settings/network/' + namespace)
                        .success(function (data) {
                            $scope.settings = data;
                            console.log(data);
                        })
                        .error(function (data) {
                            console.log('Error: ' + data);
                        });
                };



                // Remove networks that can be configured ----------------------------------*/
                $scope.disconnectNetwork = function (namespace) {
                    $http.delete('/disconnect/network/' + namespace)
                        .success(function (data) {
                            // $scope.formData = {}; // clear the form so our user is ready to enter another
                            $scope.settings = data;
                            console.log(data);
                        })
                        .error(function (data) {
                            console.log('Error: ' + data);
                        });
                };


            }])
        .controller('settingsMenu', ['$scope', '$http', function settingsController($scope, $http) {
            // when landing on the page, get all profiles and show them
            $http.get('/api/profiles')
                .success(function (data) {
                    $scope.profiles = data.profiles;
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }]);
});