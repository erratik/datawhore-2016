/*-----------------------------------------------------*
 * APP SETUP
 *-----------------------------------------------------*/
var angular = require('angular');

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

/* app routes -----------------------------------------*/
require('./routes')(datawhore);

/* app ... stuff --------------------------------------*/
require('./services')(datawhore);

require('./controllers')(datawhore);
require('./directives')(datawhore);
require('./filters')(datawhore);

// bootstrapping datawhore (maybe i should use jquery?)
require('./bootstrap')(angular);