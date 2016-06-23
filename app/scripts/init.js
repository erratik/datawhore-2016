/*--------------------------------------------------------------------------*
 * APP SETUP
 *--------------------------------------------------------------------------*/
var angular = require('angular');
var $ = require('jquery');
var _ = require('lodash');

require('angular-ui-router');
require('moment');
require('angular-moment');
require('angular-semantic-ui');
require('angular-filter');


// datawhore app
var datawhore = angular.module('app', [
    'ui.router',
    'angularMoment',
    'angular.filter',
    'angularSemanticUi'
]);


// app routes
require('./routes')(datawhore);

require('./services')(datawhore);
require('./controllers')(datawhore);
require('./filters')(datawhore);
require('./directives')(datawhore);

// bootstrapping (maybe i should use jquery?)
require('./bootstrap')(angular);