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
        'angular-moment': '../../bower_components/angular-moment/angular-moment',
        'angular-filter': '/bower_components/angular-filter/dist/angular-filter',
        'lodash': '/bower_components/lodash/lodash',
        'angular-lodash': '/bower_components/angular-lodash/angular-lodash',
        'angular-semantic': '/bower_components/angular-semantic-ui/dist/angular-semantic-ui'
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'jquery': { exports: '$' },
        'lodash': { exports: '_' },
        'angular': { deps: ['jquery'], exports: 'angular' },
        'uiRouter':{
            deps: ['angular']
        },
        'angular-filter':{
            deps: ['angular']
        },
        'angular-lodash':{
            deps: ['angular', 'lodash']
        },
        'angular-moment':{
            deps: ['angular']
        },
        'angular-semantic':{
            deps: ['jquery', 'angular']
        },
        'semantic':{
            deps: ['jquery']
        }
    },
    
    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});
