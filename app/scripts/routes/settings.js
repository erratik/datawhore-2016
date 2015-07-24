// load the setting model
var defaultSettings = require('../../../config');
var Settings = require('../models/Settings');
var Profile = require('../models/Profile');
var obj = require('../../../utils/objTools');
var str = require('../../../utils/stringTools');
var merge = require('merge'),
    original, cloned;
var mongoose = require('mongoose');
var moment = require('moment');


// expose the routes to our app with module.exports
module.exports = function(app) {
    //*****************************************************************/  
    //    timestamp and status
    //*****************************************************************/
    app.get('/api/settings', function(req, res) {
        // get settings with mongoose, return default settings if !settings.saved
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) res.send(err)
            if (!settings) settings = defaultSettings;

            res.json(settings); // return settings in JSON format
        });
    });
    app.post('/api/settings', function(req, res) {

        Settings.findOne({name: 'settings'}, function(err, settings) {
            if (!settings) {

                Settings.create({
                    name: 'settings',
                    last_modified: moment().unix(),
                    saved: true
                }, function(err, settings) {
                    if (!err) {
                        console.log(' ');
                        console.log('... creating settings');
                        console.log(' ');

                        res.json(settings);
                    }
                });
            } else {
                console.log(' ');
                console.log('... saving settings');
                console.log(' ');
                settings.last_modified = Date.now() / 1000 | 0;
                settings.save(function(err) {
                    res.json(settings);
                });
            }
        });
    });
        
    app.delete('/api/settings/', function(req, res) {
        Settings.remove({name: 'settings'}, function(err, docs) {
            if (err) console.log(err);
            var settings = defaultSettings;
            settings.last_modified = Date.now() / 1000 | 0;
            res.json(defaultSettings);
        });
    });

    // social network namespace object
    app.post('/api/settings/network/', function(req, res) {
        Settings.findOne({name: 'settings'}, function(err, settings) {
            if (err) console.log(err);

            var data = {
                    namespace: req.body.namespace,
                    type: req.body.type,
                    filename: req.body.filename
                };

            if (typeof settings.networks == 'undefined') settings.networks = {};
            settings.networks[req.body.namespace] = data;
            settings.virgin = Object.keys(settings.networks).length;
            settings.save(function(err, settings) {
                res.json(settings);
            });
        });
    });

    app.delete('/api/settings/network/', function(req, res) {
        // TODO: routes/settings - delete networks from the array
    })

    app.post('/api/settings/network/:namespace', function(req, res) {


        Settings.findOne({name: 'settings'}, function(err, settings) {
            var re = /(\s+["'])([\w.:\/&=?]+)(["'])/gm; 
            var customProps = JSON.parse("{"+req.body.customProperties.replace(re, '\"$2\"')+"}");

            if (typeof settings.configs == 'undefined') settings.configs = {};
            delete req.body.customProperties;
            settings.configs[req.params.namespace] = req.body;

            var newProps = Object.keys(customProps);
            for (var i = 0; i < newProps.length; i++) {
                if (typeof settings.configs[req.params.namespace] == 'undefined') settings.configs[req.params.namespace] = {};
                settings.configs[req.params.namespace][newProps[i]] = customProps[newProps[i]];
                settings.networks[req.params.namespace].configured = true;
            }

            settings.save(function(err, settings) {
                res.json(settings);
            });

        });

         
    });


    app.get('/api/profiles', function(req, res) {
        // get settings with mongoose, return default settings if !settings.saved
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            var profiles = {};

            var data = {
                configs: settings.configs, 
                profiles: profiles,
                networks: settings.networks
            };

            Profile.find({}, function(err, profiles) {
                if (!profiles.length) {

                    
                    console.log('no profiles saved');
                } else {

                    for (var i = 0; i < profiles.length; i++) {
                        data.profiles[profiles[i].name] = profiles[i];
                    }
                    res.json(data); // return settings in JSON format
                }
            });

        });


    });

        
    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};