/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
require([
    'angular',
    'jquery',
    'angular-ui-router',
    //'angular-lodash',
    'moment',
    'angular-moment',
    'angular-semantic-ui',
    'angular-filter',
    './routes',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index'
], function (angular) {
    'use strict';
    console.log(angular);

    /*
     * place operations that need to initialize prior to app start here
     * using the `run` function on the top-level module
     */
    //
    angular.bootstrap(document, ['app']);
    //require(['domReady!'], function (document) {
    return angular.module('app', [
        'app.services',
        'app.controllers',
        'app.filters',
        'app.directives',
        //'angular-lodash',
        'angularMoment',
        'angular.filter',
        'angularify.semantic',
        'ui.router'
    ]);
    //})();


});
