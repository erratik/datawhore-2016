var mongoose = require('mongoose');
var Settings = require('./Settings');
var flatten = require('flat');
var unflatten = require('flat').unflatten;
var moment = require('moment');
var schema = new mongoose.Schema({
    name: String,
    last_modified: Number,
    saved: Boolean,
    avatar: String,
    username: String,
    fetchedProfile: {},
    flatProfileConfig: {},
    profileConfig: {},
    profileProperties: {},
    postConfig: {}
});
schema.statics = {
        get: function(params, callback){

            var columns = params.columns;   
            console.log(params);
            if (params.namespace) {
                // Profile.findOne({name: params.namespace}, function(err, profile) {
            Profile.findOne({name: params.namespace}).select().exec(function(err, profile) {
                    if (!profile) {
                        console.log('no profile found');
                        Profile.create({
                            name: params.namespace,
                            last_modified: Date.now() / 1000 | 0,
                            avatar: params.avatar,
                            username: params.username,
                            saved: true
                        }, function(err, profile) {
                            if (!err) {
                                console.log('... profile created');
                                callback(profile);
                            }
                        });
                    } else {
                        callback(profile); // return settings in JSON format
                        
                    }
                });
            } else {

                Profile.find(function(err, profiles) {
                    if (!profiles.length) {
                        console.log('no profiles saved');
                    } else {
                        console.log(profiles.length+' profiles saved');
                        callback(profiles); // return settings in JSON format
                    }
                });
            }
                
        },
        update: function(params, callback){
            Profile.findOne({name: params.namespace}, function(err, profile) {
                if (!profile) {
                    console.log('no '+params.namespace+' profile found');
                        Profile.create({
                            name: params.namespace,
                            last_modified: Date.now() / 1000 | 0,
                            fetchedProfile: params.fetchedProfile,
                            avatar: params.avatar,
                            username: params.username,
                            saved: true
                        }, function(err, profile) {
                            if (!err) {
                                console.log('profile created');
                                console.log(profile);
                                callback(profile);
                            }
                        });
                } else {


                    var flatProfileConfig = JSON.parse(JSON.stringify(params.data.profileConfig));
                    var _profileKeys = Object.keys(flatProfileConfig);
                    for (var i = 0; i < _profileKeys.length; i++) {
                        var attribute = flatProfileConfig[_profileKeys[i]];
                        // console.log(attribute);
                        if (typeof attribute.grouped == 'boolean' && !attribute.grouped) {
                            if (!attribute.content.enabled) 
                                delete flatProfileConfig[_profileKeys[i]];
                        } else {
                            var _attributeKeys = Object.keys(attribute.content);
                            for (var j = 0; j < _attributeKeys.length; j++) {
                                var attribute = flatProfileConfig[_profileKeys[i]].content[_attributeKeys[j]];
                                if (!attribute.content.enabled) 
                                    delete flatProfileConfig[_profileKeys[i]].content[_attributeKeys[j]];

                            }
                            if (!Object.keys(flatProfileConfig[_profileKeys[i]].content).length) 
                                delete flatProfileConfig[_profileKeys[i]];
                        }
                    };
                    params.data.flatProfileConfig = flatten(flatProfileConfig, {delimiter: '$'});

                    var _savingKeys = Object.keys(params.data);
                    for (var i = 0; i < _savingKeys.length; i++) {
                        console.log('updating > '+_savingKeys[i]);

                        profile[_savingKeys[i]] = params.data[_savingKeys[i]];
                    };
                    profile.last_modified= moment().unix();

                    /// T
                    if (!params.data.profileProperties) {

                        var config = writeProfileProperties(params.data.flatProfileConfig);

                        profile.profileProperties = (unflatten(config, {delimiter:'__'}));
                    }

                    console.log(profile);
                    profile.save(function (err) {
                      if (err) return handleError(err);
                        console.log('profile saved');
                        callback(profile);
                    });
                    
                }
            });
        },
        getConfig: function(namespace, callback){

            if (namespace) {

            Profile.findOne({name: namespace}).exec(function(err, profile) {
                    if (!profile) {
                        console.log('no profile config found');

                    } else {

                        if (!profile.profileProperties) {
                            var config = writeProfileProperties(profile.flatProfileConfig);
                            callback(unflatten(config, {delimiter:'__'})); // return settings in JSON format
                        } else {
                            callback(profile.profileProperties);
                        }
                        
                    }
                });
            } else {

                Profile.find(function(err, profiles) {
                    if (!profiles.length) {
                        console.log('no profile config found');
                    } else {
                        console.log(profiles.length+' profiles saved');
                        callback(profiles); // return settings in JSON format
                    }
                });
            }
                
        }
    }

    function writeProfileProperties(config) {

            var _configKeys = Object.keys(config);
            for (var i = 0; i < _configKeys.length; i++) {
                // console.log(_configKeys[i].indexOf('enabled'));
                if  (_configKeys[i].indexOf('enabled') > -1 || _configKeys[i].indexOf('grouped') > -1 ) { 
                    delete config[_configKeys[i]];
                }

            };

            config = unflatten(config, {delimiter:'$'});
            var newFlat = flatten(config, {delimiter: '___'}); 
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
                delete  newFlat[_newKeys[i]];
                // newFlat = unflatten(newFlat, {delimiter:'__'});
            };

            return newFlat;
        

    }
    // Return a Drop model based upon the defined schema
    // module.exports = Profile;
    // Return a Drop model based upon the defined schema
module.exports = Profile = mongoose.model('Profile', schema);