// load the setting model
var Settings = require('../models/Core');
var Config = require('../models/Config');
var Profile = require('../models/Profile');
var merge = require('merge'),
    original, cloned;
var mongoose = require('mongoose');
var moment = require('moment');
var flatten = require('flat');
var unflatten = require('flat').unflatten;
// expose the routes to our app with module.exports

module.exports = function(app) {

    //*****************************************************************/  
    //    Configs
    //*****************************************************************/
    app.get('/api/configs/network', function(req, res) {
        Config.get({}, function(config){

            console.log('>> @start Config.get()');
            console.log(config);
            console.log('>> /@end');

            res.json(config);
        });
        
    });
    app.get('/api/config/network/:namespace', function(req, res) {
        Config.get({namespace: req.params.namespace}, function(config){

            //console.log('>> @start Config.get({namespace: '+req.params.namespace+'})');
            //console.log(config);
            //console.log('>> /@end /api/config/network/:'+req.params.namespace);

            res.json(config);

        });

    });
    //*****************************************************************/
    //    Profiles
    //*****************************************************************/

    app.get('/api/config/profile/:namespace', function(req, res) {

        Profile.get({name: req.params.namespace, columns: 'profile'}, function(config){

            //console.log('>> @start Profile.get({namespace: '+req.params.namespace+'})');
            //console.log(config);
            //console.log('>> /@end /api/config/profile/:'+req.params.namespace);

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

        //console.log('>> @start Config.update({namespace: '+req.params.namespace+'})');
        //console.log(config);
        //console.log('>> /@end');

        Config.update({
            namespace: req.params.namespace,
            data: req.body,
            type: 'all'
        }, function(config) {
            res.json(config);
        });
    });



};