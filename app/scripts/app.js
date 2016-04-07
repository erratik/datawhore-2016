/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'jquery',
    'uiRouter',
    'moment',
    'angular-moment',
    'angular-semantic',
    'angular-filter',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index'
], function (ng) {
    'use strict';

    return ng.module('app', [
        'app.services',
        'app.controllers',
        'app.filters',
        'app.directives',
        'angularMoment',
        'angular.filter',
        'angularify.semantic',
        'ui.router'
    ]);
});
