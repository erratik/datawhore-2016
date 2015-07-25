var app = angular.module('app', [
    'ui.router', 
    'angularMoment', 

    'controllers.Settings',
    'controllers.Profiles',
    'controllers.Profile',
    'controllers.Networks'
]);

app.filter('typeof', function(){
    return function(context){
        return typeof context;
    }
});

// use unix timestamps in angular views
app.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
}).config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('settings', {
        url: '/settings',
        controller: 'settingsController as settings',
        templateUrl: 'templates/tpl--settings.html'
    }).state('profiles', {
        url: '/',
        controller: 'profilesController',
        templateUrl: 'templates/tpl--profiles.html'
    }).state('profile', {
        url: '/profile/:namespace',
        controller: 'profileController',
        templateUrl: 'templates/tpl--profile.html'
    });
}]);
