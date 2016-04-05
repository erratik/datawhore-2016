

//'semantic': 'semantic/dist/semantic'
//'moment': 'moment/moment',
//'angular-moment': 'angular-moment/angular-moment',
//'angular-filter': 'angular-filter/dist/angular-filter'
//baseUrl: '../bower_components/',
require.config({
    paths: {
        'angular': '/bower_components/angularjs/angular',
        'jquery': '/bower_components/jquery/dist/jquery',
        'angular-route': '/bower_components/angular-route/angular-route',
        'uiRouter': '/bower_components/angular-ui-router/release/angular-ui-router',
        'moment': '/bower_components/moment/moment',
        'angular-moment': '/bower_components/angular-moment/angular-moment',
        //'datawhore': '/app/modules/core/datawhore',
        'coreModule': 'core/coreModule',
        'themeModule': 'theme/themeModule'
    },

    shim: {
        'jquery': { exports: '$' },

        'angular': { deps: ['jquery'], exports: 'angular' },
        'angular-route': { deps: ['angular']},
        'uiRouter': { deps: ['angular']},

        'coreModule': {
            deps: [
                'angular-route',
                'uiRouter',
                'themeModule'
            ]
        },

        'themeModule': {deps: ['uiRouter'] }
    }
});
//setTimeout(function() {
//
//
//
require(['coreModule'], function(){
    //angular.bootstrap(document, ['coreModule']);
});
//
//}, 0);