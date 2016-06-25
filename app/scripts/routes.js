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
        .constant('_', window._).config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

            $urlRouterProvider.when('', '/');

            $stateProvider
                .state('core', {
                    url: '/',
                    controller: 'coreController',
                    template: require('../templates/tpl--settings.html'),
                    resolve: {
                        networks: ['CoreService', function (CoreService) {
                            ////console.log(CoreService.getNetworkConfigs({namespace: false}));
                            return CoreService.getNetworks({namespace: false});
                            // return ConfigService.load($stateParams.namespace);
                        }]
                    }
                }).state('profiles', {
                    url: '/config/profiles',
                    controller: 'coreController',
                    template: require('../templates/tpl--profiles.html'),
                    resolve: {
                        networks: ['CoreService', function (CoreService) {
                            ////console.log(CoreService.getNetworkConfigs({namespace: false}));
                            return CoreService.getNetworks({namespace: false});
                            // return ConfigService.load($stateParams.namespace);
                        }]
                    }
                })
                .state('config', {
                    url: 'config/profiles/:namespace',
                    controller: 'configController',
                    template: require('../templates/tpl--profile.html'),
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
                    }
                });
        }]);

};