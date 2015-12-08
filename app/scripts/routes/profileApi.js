// load the setting model
var defaultSettings = require('../../../config');
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

    ////*****************************************************************/
    ////    Profiles
    ////*****************************************************************/
    //app.get('/api/profiles', function(req, res) {
    //    Config.get({}, function(profile){
    //        // if (req.body) console.log("jkh")
    //        res.json(profile);
    //    });
    //
    //});
    ////*****************************************************************/
    ////    Profiles
    ////*****************************************************************/
    //app.get('/api/profile/:namespace', function(req, res) {
    //    Config.get({namespace: req.params.namespace}, function(profile){
    //        res.json(profile);
    //
    //    });
    //
    //});

    // add specific properties to config -------------------------------------------------------*/
    app.post('/api/profile/update/:namespace/:configType', function(req, res) {

        console.log('>> @start Config.updateConfig({namespace: '+req.params.namespace+', type: '+req.params.configType+'}), '+req.params.configType+'Properties update');
        console.log(req.body);
        console.log('>> /@end');

        Profile.updateConfig({
            namespace: req.params.namespace,
            data: req.body,
            type: req.params.configType
        }, function(config) {
            res.json(config);
        });
    });

    //app.get('/api/profile/config/:namespace', function(req, res) {
    //    Profile.get(req.params.namespace, function(config){
    //
    //        console.log('>> @start Profile.get('+req.params.namespace+')');
    //        console.log(config);
    //        console.log('>> /@end');
    //
    //        res.json(config);
    //    });
    //
    //});

    // wipe profile -------------------------------------------------------*/
    app.delete('/api/profiles/:namespace', function(req, res) {
        // console.log('test');
        // get settings with mongoose, return default settings if !settings.saved
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) console.log(err);
            Config.remove({
                name: req.params.namespace
            }, function(err, profile) {
                if (err) res.send(err);
                settings.configs[req.params.namespace]['profile'] = false;
                Settings.updateConfig(settings.configs);
                res.json(settings.configs[req.params.namespace]);
            });
        });
    });


};