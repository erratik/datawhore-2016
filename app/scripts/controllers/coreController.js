module.exports = function (app) {

    //directives needed
    require('../directives/adminDirectives')(app, './templates/directives/');

    app
        .controller('coreController', ['$scope', '$http',  'CoreService', 'networks',
            function coreController($scope, $http, CoreService, networks) {
                $scope.networks = networks;
                $scope.networkCount = _.size(networks);
                console.info($scope);
            }
        ]);
};