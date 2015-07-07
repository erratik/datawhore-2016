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
                    saved: true,
                    configs: {
                        virgin: false
                    },
                    networks: []
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

    // social network namespace array
    app.post('/api/settings/network/', function(req, res) {
        Settings.findOne({name: 'settings'}, function(err, settings) {
            if (err) console.log(err);

            var data = {
                    namespace: req.body.namespace,
                    type: req.body.type,
                    filename: req.body.filename
                };
            console.log(settings.networks.length);
            if (settings.networks.length){
                for (var i = 0; i <= settings.networks.length; i++) {
                        if (settings.networks[i].namespace == data.namespace) 
                            settings.networks[i] = data;

                }
            } else  {
                settings.networks.push(data);
            }
            settings.save(function(err, settings) {
                res.json(settings);
            });
        });
    });

    app.delete('/api/settings/network/', function(req, res) {
        // TODO: routes/settings - delete networks from the array
    })

    app.post('/api/settings/network/:namespace', function(req, res) {
        // TODO: routes/settings - finish updating network settings

        Settings.findOne({name: 'settings'}, function(err, settings) {
            var re = /(\s+'*)(\w+[-\w]+.\w+)([\/'])*/g; 
            var customProps = req.body.customProperties.replace(re, '\"$2\"');

            req.body.customProperties = JSON.parse(customProps);
            settings.configs[req.params.namespace] = req.body;


            for (var i = 0; i <= settings.networks.length; i++) {
                if ( typeof settings.networks[i] != 'undefined' && settings.networks[i].namespace == req.params.namespace) {

                    console.log(settings.networks[i].namespace);
                    console.log('------');
                        settings.networks[i].configured = true;
                    console.log(settings.networks[i]);
                }

            }
                    console.log('------');
            console.log(settings.configs[req.params.namespace]);
                    console.log('------');
            console.log(settings.configs);

            // settings.save(function(err, settings) {
            //     res.json(settings);
            // });


        });

        // // TODO: routes/settings - FUCKING HELL, regex to add extras to network settings
        // var str = '\n            redirect_url: \'nu43242ll-if55465ied.com\',\n            count: 20';
        // var subst = '\"$2\"'; 
         
    });


    app.get('/api/profiles', function(req, res) {
        // get settings with mongoose, return default settings if !settings.saved
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            var profiles = {};
            var configs = settings.configs.toObject();
            // for (var i = 0; i < settings.networks.length; i++) {
            //     var network_config = configs[settings.networks[i].namespace];
            //     if (typeof network_config != 'undefined' && typeof network_config.profile != 'undefined') {
            //         profiles[settings.networks[i].namespace] = network_config.profile;
            //     }
               
            // }
            var data = {
                configs: configs, 
                profiles: profiles
            };

            res.json(data); // return settings in JSON format
        });
    });


    app.post('/api/profiles/network/:namespace', function(req, res) {
        // TODO: routes/profiles - create profiles if fin==ound noe

        
        Profile.find({}, function(err, profiles) {
            if (!profiles.length) {

                

                // Profile.create({
                //     name: 'settings',
                //     last_modified: moment().unix(),
                //     saved: true,
                //     configs: {
                //         virgin: false
                //     },
                //     networks: []
                // }, function(err, profiles) {
                //     if (!err) {
                        console.log(' ');
                        console.log('... creating profile for ' + req.params.namespace);
                        console.log(' ');

                        res.json(profiles);
                //     }
                // });
            } else {
                console.log(' ');
                console.log('... saving profile for ' + req.params.namespace);
                console.log(' ');
                // profiles.last_modified = Date.now() / 1000 | 0;
                // profiles.save(function(err) {
                    res.json(profiles);
                // });
            }
        });
    });
        
    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};