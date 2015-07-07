// public/core.js

var app = angular.module('app', [
        'ui.router',
        'angularMoment', 


        'directives.removeNamespace',
        'directives.configureNamespace',
        'directives.disconnectNamespace',
        'directives.customProperties',
        'directives.detailsNamespace'

    ]);

    // use unix timestamps in angular views
app.constant('angularMomentConfig', {
        preprocess: 'unix', // optional
})
.config(['$urlRouterProvider','$stateProvider', function ($urlRouterProvider, $stateProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('settings', {
            url: '/', 
            controller: 'settingsController as settings',
            templateUrl: 'templates/tpl--settings.html'
        })

        .state('todo', {
            url: '/todo', 
            controller: 'todosController as todos',
            templateUrl: 'templates/tpl--todos.html'
        });
}]);

app.controller('settingsController', ['$scope', '$http', function settingsController($scope, $http) {

    $scope.formData = {};

    // when landing on the page, get all settings and show them
    $http.get('/api/settings')
        .success(function(data) {
            $scope.settings = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

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
        console.log($scope.formData);
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


    // Add networks that can be configured ----------------------------------*/
    $scope.disconnectNamespace = function(namespace) {
        $http.post('/dicsonnect/network/', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.settings = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}])