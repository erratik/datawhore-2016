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
var flatten = require('flat');
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
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
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
        Settings.remove({
            name: 'settings'
        }, function(err, docs) {
            if (err) console.log(err);
            var settings = defaultSettings;
            settings.last_modified = Date.now() / 1000 | 0;
            res.json(defaultSettings);
        });
    });
    //*****************************************************************/  
    //    networks
    //*****************************************************************/
    // create network object -------------------------------------------------------*/
    app.post('/api/settings/network/', function(req, res) {
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) console.log(err);
            var data = {
                namespace: req.body.namespace,
                type: req.body.type,
                filename: req.body.filename
            };
            if (typeof settings.networks == 'undefined') settings.networks = {};
            settings.networks[req.body.namespace] = data;
            Settings.updating({
                networks: settings.networks
            }, function(settings) {
                res.json(settings);
            });
        });
    });
    // configure network -------------------------------------------------------*/
    app.post('/api/settings/network/:namespace', function(req, res) {
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (typeof settings.configs[req.params.namespace] == 'undefined') settings.configs[req.params.namespace] = {};
            settings.configs[req.params.namespace] = req.body;
            if (req.body.customProperties) {
                var re = /(\s+["'])([\w.:\/&=?]+)(["'])/gm;
                var customProps = JSON.parse("{" + req.body.customProperties.replace(re, '\"$2\"') + "}");
                if (typeof settings.configs == 'undefined') settings.configs = {};
                delete req.body.customProperties;
                var newProps = Object.keys(customProps);
                for (var i = 0; i < newProps.length; i++) {
                    settings.configs[req.params.namespace][newProps[i]] = customProps[newProps[i]];
                }
            }
            settings.networks[req.params.namespace].configured = true;
            Settings.updating({
                configs: settings.configs,
                networks: settings.networks
            }, function(settings) {
                res.json(settings);
            });
        });
    });
    // remove network settings -------------------------------------------------------*/
    app.delete('/api/settings/network/:namespace', function(req, res) {
            Settings.findOne({
                name: 'settings'
            }, function(err, settings) {
                if (err) console.log(err);
                delete settings.networks[req.params.namespace];
                Settings.updating({
                    networks: settings.networks
                }, function(settings) {
                    res.json(settings);
                });
            });
        })
        // remove network config -------------------------------------------------------*/
    app.delete('/disconnect/network/:namespace', function(req, res) {
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            delete settings.configs[req.params.namespace];
            settings.networks[req.params.namespace].connected = false;
            Settings.updating({
                configs: settings.configs,
                networks: settings.networks
            }, function(settings) {
                res.json(settings);
            });
        });
    });
    //*****************************************************************/  
    //    Profiles
    //*****************************************************************/
    app.get('/api/profiles', function(req, res) {
        // get settings with mongoose, return default settings if !settings.saved
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            var profiles = {};
            var data = {
                configs: settings.configs,
                profiles: profiles
                    // networks: settings.networks
            };
            Profile.find(function(err, profiles) {
                if (!profiles.length) {
                    console.log('no profiles saved');
                } else {
                    for (var i = 0; i < profiles.length; i++) {
                        if (typeof profiles[i]['profile'] == 'object') profiles[i]['profile'] = flatten(profiles[i]['profile']);
                        // console.log(profiles[i]['profile']);
                        data.profiles[profiles[i].name] = profiles[i];
                        var profileKeys = Object.keys(profiles[i]['profile']);
                        for (var j = 0; j < profileKeys.length; j++) {
                            var re = /(\.+)/g;
                            var str = profileKeys[j];
                            var subst = '_';
                            var safeKey = str.replace(re, subst);

                            data.profiles[profiles[i].name]['profile'][safeKey] = data.profiles[profiles[i].name]['profile'][profileKeys[j]];
                            if (str.indexOf('.') != -1) delete data.profiles[profiles[i].name]['profile'][profileKeys[j]];
                        };
                    }
                }
                res.json(data); // return settings in JSON format
            });
        });
    });
    // wipe profile -------------------------------------------------------*/
    app.delete('/api/profiles/:namespace', function(req, res) {
        // get settings with mongoose, return default settings if !settings.saved
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) console.log(err);
            Profile.remove({
                name: req.params.namespace
            }, function(err, profile) {
                if (err) res.send(err);
                settings.configs[req.params.namespace]['profile'] = false;
                Settings.updateConfig(settings.configs);
                // get and return all the todos after you create another
                Profile.find(function(err, profiles) {
                    if (err) res.send(err)
                    var data = {
                        configs: settings.configs,
                        profiles: profiles
                            // networks: settings.networks
                    };
                    res.json(data);
                });
            });
        });
    });
    // add specific properties to profile -------------------------------------------------------*/
    app.post('/api/profile/props/:namespace', function(req, res) {
        Profile.nominateProfileProperties({
            namespace: req.params.namespace,
            data: req.body
        }, function(data) {
            console.log('Settings Route > nominateProfileProperties');
            res.json(data);
        });
    });
    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        res.sendfile('./app/settings.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    // app.get('/profiles', function(req, res) {
    //     res.sendfile('./app/profiles.html'); // load the single view file (angular will handle the page changes on the front-end)
    // });
};