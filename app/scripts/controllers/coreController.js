module.exports = function (app) {

    app
        .controller('coreController', ['$scope', '$http',  'CoreService', 'networks',
            function coreController($scope, $http, CoreService, networks) {
                $scope.networks = networks;
                $scope.networkCount = _.size(networks);
                console.info($scope);
            }
        ]);
};