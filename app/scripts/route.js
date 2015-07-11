;(function (angular) {
    'use strict';

    var app = angular.module('mainRouter', ['ngRoute']);

    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/settings', {
                    controller: 'settingsController as settings',
                    templateUrl: 'templates/tpl--profiles.html'
                }).
                when('/settings/networks/:namespace', {
                    controller: 'profilesController as settings',
                    templateUrl: 'templates/tpl--profiles.html'
                }).
                when('/login', {
                    templateUrl: 'partials/auth.html',
                    controller: 'AuthCtrl'
                }).
                when('/tabs', {
                    templateUrl: 'partials/tabular.html',
                    controller: 'TabularCtrl'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }
    ]);
})(angular);
