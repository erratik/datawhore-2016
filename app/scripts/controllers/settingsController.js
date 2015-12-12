// public/core.js

var app = angular.module('controllers.Settings', [
        'angularMoment', 

        'directives.removeNamespace',
        'directives.configureNamespace',
        'directives.disconnectNamespace',
        'directives.customProperties',
        'directives.detailsNamespace'

    ]);


app.controller('settingsController', ['$scope', '$http', 'SettingsService', function settingsController($scope, $http, SettingsService) {



    $scope.SettingsService = angular.copy(SettingsService);

    // $scope.profiles.load();
    $scope.SettingsService.load().then(function(items){
        // console.log(items);
       $scope.settings = items;
       $scope.formData = items.formData;
            console.log($scope);
            init();
    });
    
    // $scope.updateProfileProps = function(namespace) {
    //     $scope.ProfileService.updateProps(namespace, false, $scope.formData[namespace]).then(function(profile){
    //         // console.log(profile);
    //         $scope.model.profiles[namespace] = profile;
    //         // $scope.edit[namespace]=!$scope.edit[namespace];
    //     });
    // };

    // when submitting the add form, send the text to the node API
    $scope.createSettings = function() {
        $scope.settings.last_modified = Date.now() / 1000 | 0;

        $http.post('/api/settings', $scope.settings)
            .success(function(data) {
                $scope.settings = data;
                console.log(data);
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


    // Add networks that can be configured ----------------------------------*/
    $scope.addNetworkNamespace = function() {
        $http.post('/api/settings/network/', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.settings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    $scope.deleteNetworkNamespace = function(namespace) {
        console.log(namespace);
        $http.delete('/api/settings/network/'+namespace)
            .success(function(data) {
                $scope.settings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };



    // Add/update or a network ----------------------------------*/
    $scope.configureNetwork = function(namespace) {
        
        $http.post('/api/settings/network/'+namespace, $scope.formData)
            .success(function(data) {
                //$scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.settings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


    // Remove networks that can be configured ----------------------------------*/
    $scope.disconnectNetwork = function(namespace) {
        $http.delete('/disconnect/network/'+namespace)
            .success(function(data) {
                // $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.settings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


}])


app.controller('settingsMenu', ['$scope', '$http', function settingsController($scope, $http) {
    // when landing on the page, get all profiles and show them
    $http.get('/api/profiles')
        .success(function(data) {
            $scope.profiles = data.profiles;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}]);