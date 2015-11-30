//// public/core.js
//
//var app = angular.module('controllers.Networks', [
//        'angularMoment',
//        'ui.router'
//
//        // 'directives.profileUpdated',
//        // 'directives.profileRemove',
//        // 'directives.profileFetch',
//        // 'directives.profileAvatar'
//
//    ]);
//
//app.controller('networksController', ['$scope', '$http', '$state', '$stateParams', function networksController($scope, $http, $route) {
//    console.log($state);
//    // when landing on the page, get all profiles and show them
//    $http.get('/api/networks')
//        .success(function(data) {
//            // console.log(data);
//            $scope.network = {
//                config: data.config,
//                profile: data.profile
//            }
//        })
//        .error(function(data) {
//            console.log('Error: ' + data);
//        });
//
//    // when submitting the add form, send the text to the node API
//    $scope.getProfile = function(namespace) {
//        console.log('getProfile');
//        // post goes to each network's api routes js
//
//        $http.post('/api/profiles/'+namespace, {configs: $scope.configs, profiles: $scope.profiles})
//            .success(function(data) {
//                console.log(data);
//                $scope.configs = data.configs;
//                $scope.profiles = data.profiles;
//            })
//            .error(function(data) {
//                console.log('Error: ' + data);
//            });
//    };
//
//    // delete a setting after checking it
//    $scope.deleteProfile = function(namespace) {
//        $http.delete('/api/profiles/'+namespace, {profiles: $scope.profiles})
//            .success(function(data) {
//                delete $scope.profiles[namespace];
//                $scope.configs[namespace].profile = false;
//                console.log(data);
//                console.log($scope);
//            })
//            .error(function(data) {
//                console.log('Error: ' + data);
//            });
//    };
//
//
//}]);
//
