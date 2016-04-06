/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
require.config({

    paths: {
        'jquery': '/bower_components/jquery/dist/jquery',
        'semantic': '/bower_components/semantic/dist/semantic',
        'domReady': '../lib/requirejs-domready/domReady',
        'angular': '/bower_components/angularjs/angular',
        'uiRouter': '/bower_components/angular-ui-router/release/angular-ui-router',
        'moment': '/bower_components/moment/moment',
        'angular-moment': '/bower_components/angular-moment/angular-moment',
        'angular-filter': '/bower_components/angular-filter/dist/angular-filter',
        'angular-semantic': '/bower_components/angular-semantic-ui/dist/angular-semantic-ui'
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'jquery': { exports: '$' },
        'angular': { deps: ['jquery'], exports: 'angular' },
        'uiRouter':{
            deps: ['angular']
        },
        'angular-filter':{
            deps: ['angular']
        },
        'angular-moment':{
            deps: ['angular']
        },
        'angular-semantic':{
            deps: ['angular']
        }
    },
    
    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});
