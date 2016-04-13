var mongoose = require('mongoose');
var moment = require('moment');

var defaultCore = require('../../../../config');
var Core = require('../models/Core');

// expose the routes to our app with module.exports
module.exports = function(app) {
    //*****************************************************************/  
    //    timestamp and status
    //*****************************************************************/
    app.get('/api/core', function(req, res) {
        // get settings with mongoose, return default settings if !settings.saved
        Core.getNetworkConfigs({}, function(data){
            //console.log(data);
            //console.log('test2');

            res.json(data);
        });
    });

    app.post('/api/settings', function(req, res) {
        Core.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (!settings) {
                Core.create({
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
        Core.remove({
            name: 'settings'
        }, function(err, docs) {
            if (err) console.log(err);
            var settings = defaultCore;
            settings.last_modified = Date.now() / 1000 | 0;
            res.json(defaultCore);
        });
    });
    //*****************************************************************/  
    //    networks
    //*****************************************************************/
    // create network object -------------------------------------------------------*/
    app.post('/api/settings/network/', function(req, res) {
        Core.findOne({
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
            Core.updating({
                networks: settings.networks
            }, function(settings) {
                res.json(settings);
            });
        });
    });
    // configure network -------------------------------------------------------*/
    app.post('/api/settings/network/:namespace', function(req, res) {
        Core.findOne({
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
            Core.updating({
                configs: settings.configs,
                networks: settings.networks
            }, function(settings) {
                res.json(settings);
            });
        });
    });
    // remove network settings -------------------------------------------------------*/
    app.delete('/api/settings/network/:namespace', function(req, res) {
            Core.findOne({
                name: 'settings'
            }, function(err, settings) {
                if (err) console.log(err);
                delete settings.networks[req.params.namespace];
                Core.updating({
                    networks: settings.networks
                }, function(settings) {
                    res.json(settings);
                });
            });
        })
        // remove network config -------------------------------------------------------*/
    app.delete('/disconnect/network/:namespace', function(req, res) {
        Core.findOne({
            name: 'settings'
        }, function(err, settings) {
            delete settings.configs[req.params.namespace];
            settings.networks[req.params.namespace].connected = false;
            Core.updating({
                configs: settings.configs,
                networks: settings.networks
            }, function(settings) {
                res.json(settings);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        res.sendfile('../../index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};