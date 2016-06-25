/*-----------------------------------------------------*
 * APP SETUP
 *-----------------------------------------------------*/
var angular = require('angular');
var $ = require('jquery');
var _ = require('lodash');

/* angular modules -----------------------------------*/
// require('../styles/css/main.css');

/* angular modules -----------------------------------*/
require('angular-ui-router');
require('moment');
require('angular-moment');
require('angular-semantic-ui');
require('angular-filter');

/*  datawhore app with module dependencies  ----------*/
var datawhore = angular.module('app', [
    'ui.router',
    'angularMoment',
    'angular.filter',
    'angularSemanticUi'
]);


datawhore.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
    console.log('l;;lp');

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
        url: 'config/profiles',
        controller: 'coreController',
        template: require('../templates/tpl--profiles.html'),
        resolve: {
            networks: ['CoreService', function (CoreService) {
                ////console.log(CoreService.getNetworkConfigs({namespace: false}));
                return CoreService.getNetworks({namespace: false});
                // return ConfigService.load($stateParams.namespace);
            }]
        }
    });
}]);

/* app ... stuff --------------------------------------*/
require('./services')(datawhore);

require('./controllers/coreController')(datawhore);