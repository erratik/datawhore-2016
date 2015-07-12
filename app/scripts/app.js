var app = angular.module('app', [
    'ui.router', 
    'angularMoment', 
    
    'controllers.Settings',
    'controllers.Profiles'
]);
// use unix timestamps in angular views
app.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
}).config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider
        // when('/settings', {
        //     controller: 'settingsController as settings',
        //     templateUrl: 'templates/tpl--settings.html'
        // })
        .otherwise('/');
    $stateProvider.state('settings', {
        url: '/settings',
        controller: 'settingsController as settings',
        templateUrl: 'templates/tpl--settings.html'
    }).state('profiles', {
        url: '/',
        controller: 'profilesController',
        templateUrl: 'templates/tpl--profiles.html'
    }).state('profile', {
        url: '/profiles/:namespace',
        controller: 'settingsController as settings',
        templateUrl: 'templates/tpl--settings.html'
    });
}]);