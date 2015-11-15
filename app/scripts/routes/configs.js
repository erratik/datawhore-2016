// load the setting model
var Settings = require('../models/Settings');
var Config = require('../models/Config');
var merge = require('merge'),
    original, cloned;
var mongoose = require('mongoose');
var moment = require('moment');
var flatten = require('flat');
var unflatten = require('flat').unflatten;
// expose the routes to our app with module.exports

module.exports = function(app) {

    //*****************************************************************/  
    //    Profiles
    //*****************************************************************/
    app.get('/api/configs', function(req, res) {
        Config.get({}, function(config){
            // if (req.body) console.log("jkh")
            delete config
            res.json(config);
        });
        
    });
    //*****************************************************************/  
    //    Profiles
    //*****************************************************************/
    app.get('/api/config/:namespace', function(req, res) {
        Config.get({namespace: req.params.namespace}, function(config){

            res.json(config);

        });

    });

    app.get('/api/config/config/:namespace', function(req, res) {
        Config.getConfig(req.params.namespace, function(config){
            res.json(config);
        });

    });

    // wipe config -------------------------------------------------------*/
    app.delete('/api/configs/:namespace', function(req, res) {
        // console.log('test');
        // get settings with mongoose, return default settings if !settings.saved
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) console.log(err);
            Config.remove({
                name: req.params.namespace
            }, function(err, config) {
                if (err) res.send(err);
                settings.configs[req.params.namespace]['config'] = false;
                Settings.updateConfig(settings.configs);
                res.json(settings.configs[req.params.namespace]);
            });
        });
    });
    // add specific properties to config -------------------------------------------------------*/
    app.post('/api/config/update/:namespace', function(req, res) {


            Config.update({
                namespace: req.params.namespace,
                data: req.body
            }, function(config) {
                res.json(config);
            });
    });


};