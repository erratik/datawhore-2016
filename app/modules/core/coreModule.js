/**
 * Created by tay on 16-04-03.
 */
define(['core/runners/logRunner'], function(logRunner){




    require([
        'angular',
        'core/controllerReferences',
        'uiRouter'

    ], function(angular, references){

        require(references, function(){
            //angular.bootstrap(document, ['coreModule']);
            console.log(references);
            //setTimeout(function(){
            var coreModule = angular.module('coreModule', [ 'ui.router',  'themeModule']);
            console.log('boom');


            coreModule.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
                console.log($stateProvider);
                $urlRouterProvider.otherwise('/');

                $stateProvider.state('settings', {
                    url: '/settings',
                    controller: 'settingsController as settings',
                    templateUrl: 'templates/tpl--settings.html'
                }).state('home', {
                    url: '/',
                    controller: 'configController',
                    templateUrl: '/app/templates/tpl--profiles.html',
                    resolve: {
                        load: ['$q', function($q){
                            var deferred = $q.defer();
                            require(['core/controllers/configController'], function(config){
                                deferred.resolve();
                                console.log('lalala');

                            });

                            return deferred.promise;
                        }]

                    }
                }).state('config', {
                    url: '/config/:namespace',
                    controller: 'configController',
                    templateUrl: 'templates/tpl--profile.html',
                    resolve: {
                        config: function(ConfigService, $stateParams) {
                            ////console.log(ConfigService.getNetworkConfig({namespace: $stateParams.namespace, loadConfig: true}));
                            return ConfigService.getConfig($stateParams.namespace);
                            // return ConfigService.load($stateParams.namespace);
                        },
                        profile: function(ProfileService, $stateParams) {
                            return ProfileService.getProfile( $stateParams.namespace );
                            // return ConfigService.load($stateParams.namespace);
                        }
                    }
                });
            }]);

            coreModule.filter('typeof', function(){
                return function(context){
                    return typeof context;
                }
            });
            coreModule.filter('length', function(){
                return function(context){
                    // //console.log(context.length);
                    return (typeof context == "object") ? Object.keys(context).length : '';
                }
            });
            coreModule.filter('fromNow', function(){
                return function(date){
                    return moment.unix(date).fromNow();
                }
            });
            coreModule.filter('orderObjectBy', function(){
                return function(input, attribute) {
                    if (!angular.isObject(input)) return input;

                    var array = [];
                    for(var objectKey in input) {
                        array.push(input[objectKey]);
                    }

                    array.sort(function(a, b){
                        a = parseInt(a[attribute]);
                        b = parseInt(b[attribute]);
                        return a - b;
                    });
                    return array;
                }
            });
            coreModule.run(logRunner);
                angular.bootstrap(document, ['coreModule']);
            //}, 100);

        });
    });




});