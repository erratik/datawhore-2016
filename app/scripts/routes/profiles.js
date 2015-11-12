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
        Profile.get({}, function(profile){
            res.json(profile);
        });
        
    });
    //*****************************************************************/  
    //    Profiles
    //*****************************************************************/
    app.get('/api/profile/:namespace', function(req, res) {

        Profile.get({namespace: req.params.namespace}, function(profile){
            res.json(profile);
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
            });
        });
    });
    // add specific properties to profile -------------------------------------------------------*/
    app.post('/api/profile/update/:namespace', function(req, res) {
        console.log('Settings Route > /api/profile/props/'+req.params.namespace+' > req.body');
            Profile.updateConfig({
                namespace: req.params.namespace,
                data: req.body
            }, function(profile) {
                res.json(profile);
            });
    });
    // application -------------------------------------------------------------
    
    app.get('/profiles', function(req, res) {
        res.sendfile('./app/profiles.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};