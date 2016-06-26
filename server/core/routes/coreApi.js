var mongoose = require('mongoose');
var moment = require('moment');


var Core = require('../models/Core');
var Config = require('../models/Config');

// expose the routes to our app with module.exports
module.exports = function(app) {
    //*****************************************************************/  
    //    timestamp and status
    //*****************************************************************/
    app.get('/api/core', function(req, res) {
        // get settings with mongoose, return default settings if !settings.saved
        Config.getAll(function(err, data){
            res.json(data);
        });
    });

    // create network object -------------------------------------------------------*/
    app.post('/api/core/add/:namespace', function(req, res) {
        //console.log(req.params.namespace);

        var _config = new Config({name: req.params.namespace}); // instantiated Config
        //console.log(_config);

        _config.updateConfigModel({
            type: 'network'
        }, function(config) {
            //console.log(config);
            res.json(config);
        });

    });

    // update network settings in a config -------------------------------------------------------*/
    app.post('/api/core/update/:namespace', function(req, res) {
        var _config = new Config({name: req.params.namespace}); // instantiated Config
        //console.log(req.body);
        _config.updateConfigModel({
            data: req.body,
            type: 'core'
        }, function(config) {
            //console.log(cssonfig);
            res.json(config);
        });
    });

    // create network object -------------------------------------------------------*/
    app.post('/api/core/delete/:namespace', function(req, res) {
        //console.log(req.params.namespace);

        var _config = new Config({name: req.params.namespace}); // instantiated Config
        //console.log(_config);

        _config.delete(function(config) {
            //console.log(config);
            res.json(config);
        });

    });

    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        res.sendfile('../../index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};