//// public/core.js
define(function(){
    var app = angular.module('coreModule', [
        //
        //'directives.profileUpdated',
        //'directives.profileRemove',
        //'directives.profileUsername',
        //'directives.profileAvatar',
        //'directives.profileFetch',
        //'directives.profileCard',
        //'directives.profileRow',
        //'tabs'
    ]);



    app.controller('networksController', ['$scope', '$http', 'CoreService', 'networks', 'configs',
        function networksController($scope, $http, CoreService, networks, configs) {
            ////console.log($scope);

            $scope.networks = networks;
            $scope.configs = configs;
            //console.log($scope);

            // when submitting the add form, send the text to the node API
            //$scope.cleanProfile = function(namespace) {
            //    ConfigService.cleanProfile({namespace: namespace}).then(function(data){
            //        // $scope.profiles[namespace]
            //        //console.log(data);
            //    });
            //};

        }]);



});
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
//
