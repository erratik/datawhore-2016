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
    //    Profiles
    //*****************************************************************/
    app.get('/api/profiles', function(req, res) {

        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
        // get settings with mongoose, return default settings if !settings.saved
            // console.log('/api/profiles > req.body');
            // console.log(req.body);
            var profiles = {};
            var data = {
                profiles: profiles,
                configs: settings.configs
                    // networks: settings.networks
            };
            Profile.find(function(err, profiles) {
                if (!profiles.length) {
                    console.log('no profiles saved');
                } else {
                    for (var i = 0; i < profiles.length; i++) {

                        if (typeof profiles[i]['fetchedProfile'] == 'object') {
                            profiles[i]['fetchedProfile'] = flatten(profiles[i]['fetchedProfile'], {delimiter: '__'});
                        }
                        
                        data.profiles[profiles[i].name] = profiles[i];
                    }

                }
                res.json(data); // return settings in JSON format
            });
        });
        
    });
    //*****************************************************************/  
    //    Profiles
    //*****************************************************************/
    app.get('/api/profile/:namespace', function(req, res) {

        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            var data = {
                config: settings.configs[req.params.namespace]
            };
        // get settings with mongoose, return default settings if !settings.saved
            Profile.findOne({name: req.params.namespace}, function(err, profile) {
                if (!profile) {
                    console.log('no profile found');
                } else {
                    profile.fetchedProfile = flatten(profile.fetchedProfile, {delimiter: '__'});
                    data.profile = profile
                    // console.log(data);
                    res.json(data); // return settings in JSON format
                    
                }
            });
        });
    });
    // wipe profile -------------------------------------------------------*/
    app.delete('/api/profiles/:namespace', function(req, res) {
        // console.log('test');
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
                res.json(settings.configs[req.params.namespace]);
                // get and return all the todos after you create another
                // Profile.findOne({name: req.params.namespace}, function(err, profile) {
                //     if (err) res.send(err)
                //     var data = {
                //         config: settings.configs.[req.params.namespace],
                //         profile: profile
                //             // networks: settings.networks
                //     };
                //     res.json(profile);
                // });
            });
        });
    });
    // add specific properties to profile -------------------------------------------------------*/
    app.post('/api/profile/props/:namespace', function(req, res) {
        console.log('Settings Route > /api/profile/props/'+req.params.namespace+' > req.body');
        console.log(req.body);
        Profile.nominateProfileProperties({
            namespace: req.params.namespace,
            data: req.body.data,
            enabling: req.body.enabling
        }, function(data) {
            console.log('Settings Route > nominateProfileProperties (enabling:'+req.body.enabling+')');
            data.fetchedProfile = flatten(data.fetchedProfile, {delimiter: '__'})
            res.json(data);
        });
    });
    // application -------------------------------------------------------------
    
    app.get('/profiles', function(req, res) {
        res.sendfile('./app/profiles.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};