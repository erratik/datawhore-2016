/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

module.exports = function (app) {
    'use strict';

    return app
    //     .constant('angularMomentConfig', {
    //     preprocess: 'unix' // optional
    // })
        .constant('_', window._)
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

            // use the HTML5 History API
            // $locationProvider.html5Mode(true);
            // $locationProvider.hashPrefix('!');
            $urlRouterProvider.when('', '/');

            $stateProvider
                .state('core', {
                    url: '/',
                    controller: 'coreController',
                    template: require('../templates/tpl--settings.html'),
                    resolve: {
                        networks: ['CoreService', function (CoreService) {
                            return CoreService.getNetworks({namespace: false});
                        }]
                    }
                }).state('profiles', {
                    url: '/config/profiles',
                    controller: 'coreController',
                    template: require('../templates/tpl--profiles.html'),
                    resolve: {
                        networks: ['CoreService', function (CoreService) {
                            return CoreService.getNetworks({namespace: false});
                        }]
                    }
                })
                .state('config', {
                    url: '/config/profiles/:namespace',
                    controller: 'configController',
                    template: require('../templates/tpl--profile.html'),
                    resolve: {
                        config: ['ConfigService', '$stateParams', function (ConfigService, $stateParams) {
                            console.log($stateParams);
                            return ConfigService.getConfig($stateParams.namespace);
                        }],
                        profile: ['ProfileService', '$stateParams', function (ProfileService, $stateParams) {
                            return ProfileService.getProfile($stateParams.namespace);
                        }]
                    }
                });
        }]);

};