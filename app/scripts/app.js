
    var app = angular.module('app', ['ui.router', 'angularMoment', 'controllers.Settings', 'directives.removeNamespace', 'directives.configureNamespace', 'directives.disconnectNamespace', 'directives.customProperties', 'directives.detailsNamespace']);
    // use unix timestamps in angular views
    app.constant('angularMomentConfig', {
        preprocess: 'unix', // optional
    }).config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('settings', {
            url: '/',
            controller: 'settingsController as settings',
            templateUrl: 'templates/tpl--settings.html'
        }).state('profiles', {
            url: '/profiles',
            controller: 'settingsController as settings',
            templateUrl: 'templates/tpl--profiles.html'
        });
    }]);