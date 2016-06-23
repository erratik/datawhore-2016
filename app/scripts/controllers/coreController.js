module.exports = function (app) {
    app
        .controller('coreController', ['$scope', '$http',  'CoreService', 'networks',
            function coreController($scope, $http, CoreService, networks) {

                $scope.networks = networks;
                $scope.networkCount = _.size(networks);
                console.info($scope);


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
};