/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

/*define(['./app'], function (app) {
 'use strict';
 return app.config(['$routeProvider', function ($routeProvider) {
 $routeProvider.when('/view1', {
 templateUrl: 'partials/partial1.html',
 controller: 'MyCtrl1'
 });

 $routeProvider.when('/view2', {
 templateUrl: 'partials/partial2.html',
 controller: 'MyCtrl2'
 });

 $routeProvider.otherwise({
 redirectTo: '/view1'
 });
 }]);
 });*/
define(['./app'], function (app) {
    'use strict';
    return app.constant('angularMomentConfig', {
        preprocess: 'unix' // optional
    }).constant('_', window._).config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $stateProvider
            .state('core', {
                url: '/',
                controller: 'coreController',
                templateUrl: 'templates/tpl--settings.html',
                resolve: {
                    networks: ['CoreService', function (CoreService) {
                        ////console.log(CoreService.getNetworkConfigs({namespace: false}));
                        return CoreService.getNetworks({namespace: false});
                        // return ConfigService.load($stateParams.namespace);
                    }]
                }
            }).state('networks', {
                url: '/',
                controller: 'networksController',
                templateUrl: 'templates/tpl--profiles.html',
                resolve: {
                    networks: ['CoreService', function (CoreService) {
                        ////console.log(CoreService.getNetworkConfigs({namespace: false}));
                        return CoreService.getNetworks({namespace: false});
                        // return ConfigService.load($stateParams.namespace);
                    }]
                }
            })
            .state('config', {
                url: '/config/:namespace',
                controller: 'configController',
                templateUrl: 'templates/tpl--profile.html',
                resolve: {
                    config: ['ConfigService', '$stateParams', function (ConfigService, $stateParams) {
                        ////console.log(ConfigService.getNetworkConfig({namespace: $stateParams.namespace, loadConfig: true}));
                        return ConfigService.getConfig($stateParams.namespace);
                        // return ConfigService.load($stateParams.namespace);
                    }],
                    profile: ['ProfileService', '$stateParams', function (ProfileService, $stateParams) {
                        return ProfileService.getProfile($stateParams.namespace);
                        // return ConfigService.load($stateParams.namespace);
                    }]
                    //
                    //profile: ['$q', function($q){
                    //    var deferred = $q.defer();
                    //    require(['ProfileService'], function(ProfileService, $stateParams){
                    //        deferred.resolve();
                    //
                    //    });
                    //
                    //    return deferred.promise;
                    //}]
                }
            });
    }]);
});