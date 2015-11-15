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
var unflatten = require('flat').unflatten;
// expose the routes to our app with module.exports

module.exports = function(app) {

    //*****************************************************************/  
    //    Profiles
    //*****************************************************************/
    app.get('/api/profiles', function(req, res) {
        Profile.get({}, function(profile){
            // if (req.body) console.log("jkh")
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

    app.get('/api/profile/config/:namespace', function(req, res) {
        Profile.getConfig(req.params.namespace, function(profile){
            
            var _profileKeys = Object.keys(profile);
            for (var i = 0; i < _profileKeys.length; i++) {
                // console.log(_profileKeys[i].indexOf('enabled'));
                if  (_profileKeys[i].indexOf('enabled') > -1 || _profileKeys[i].indexOf('grouped') > -1 ) { 
                    delete profile[_profileKeys[i]];
                }

            };

            profile = unflatten(profile, {delimiter:'$'});
            var newFlat = flatten(profile, {delimiter: '___'}); 
            var _newKeys = Object.keys(newFlat);

            for (var i = 0; i < _newKeys.length; i++) {

                var keyStr = _newKeys[i].replace(/___content/g, '');
                var newKey = keyStr.replace(/__/, '') ;
                var _keys = newKey.split('_');
                var propertyKeys = '';

                for (var k = 0; k < _keys.length; k++) {
                   // console.log(_keys[i].length);
                   if (_keys[k].length) {
                       if (_keys[k] == 'label' || _keys[k] == 'value' && k < _keys.length) propertyKeys +='_';
                       propertyKeys += _keys[k];
                       if (k != _keys.length-1) propertyKeys +='_';
                   }
                };

                newFlat[propertyKeys] = newFlat[_newKeys[i]];
                delete newFlat[_newKeys[i]];

            };

            profile.selected = newFlat;
            res.json(unflatten(newFlat, {delimiter:'__'}));
            
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

            req.body.flatProfileConfig = JSON.parse(JSON.stringify(req.body.profileConfig));
            var _profileKeys = Object.keys(req.body.flatProfileConfig);
            for (var i = 0; i < _profileKeys.length; i++) {
                var attribute = req.body.flatProfileConfig[_profileKeys[i]];
                // console.log(attribute);
                if (typeof attribute.grouped == 'boolean' && !attribute.grouped) {
                    if (!attribute.content.enabled) 
                        delete req.body.flatProfileConfig[_profileKeys[i]];
                } else {
                    var _attributeKeys = Object.keys(attribute.content);
                    for (var j = 0; j < _attributeKeys.length; j++) {
                        var attribute = req.body.flatProfileConfig[_profileKeys[i]].content[_attributeKeys[j]];
                        if (!attribute.content.enabled) 
                            delete req.body.flatProfileConfig[_profileKeys[i]].content[_attributeKeys[j]];

                    }
                    if (!Object.keys(req.body.flatProfileConfig[_profileKeys[i]].content).length) 
                        delete req.body.flatProfileConfig[_profileKeys[i]];
                }
            };
            req.body.flatProfileConfig = flatten(req.body.flatProfileConfig, {delimiter: '$'});

            Profile.update({
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