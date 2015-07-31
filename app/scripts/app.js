var app = angular.module('app', [
    'ui.router', 
    'angularMoment', 

    'controllers.Settings',
    'controllers.Profiles',
    'controllers.Networks'
]);

app.filter('typeof', function(){
    return function(context){
        return typeof context;
    }
});
app.filter('length', function(){
    return function(context){
        // console.log(context.length);
        return (typeof context == "object") ? Object.keys(context).length : '';
    }
});
app.filter('fromNow', function(){
    return function(date){
        return moment.unix(date).fromNow();
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
        controller: 'profilesController as model',
        templateUrl: 'templates/tpl--profiles.html'
    }).state('profile', {
        url: '/profile/:namespace',
        controller: 'profileController',
        templateUrl: 'templates/tpl--profile.html'
    });
}]);
