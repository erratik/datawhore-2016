var mongoose = require('mongoose');
var Profile = require('./Profile');
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
            // console.log(params);
            if (params.namespace) {
                // Config.findOne({name: params.namespace}, function(err, profile) {
            Config.findOne({name: params.namespace}).select().exec(function(err, config) {
                    if (!config) {
                        console.log('no config found');
                        Config.create({
                            name: params.namespace,
                            last_modified: Date.now() / 1000 | 0,
                            avatar: params.avatar,
                            username: params.username,
                            saved: true
                        }, function(err, config) {
                            if (!err) {
                                console.log('... config created');
                                callback(config);
                            }
                        });
                    } else {
                        Profile.get(config,function(profile) {
                            if (!config) {
                                console.log('no abridged config found');
                            } else {
                                console.log(profile);
                            }
                        });
                        callback(config); // return settings in JSON format
                        
                    }
                });
            } else {

                Config.find(function(err, configs) {
                    if (!configs.length) {
                        console.log('no configs saved');
                    } else {
                        console.log(configs.length+' configs saved');
                        callback(configs); // return settings in JSON format
                    }
                });
            }
                
        },
        update: function(params, callback){
            Config.findOne({name: params.namespace}, function(err, config) {
                if (!config) {
                    console.log('no '+params.namespace+' config found');
                } else {

                    if (params.data.profileConfig) {

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

                    }
                    var _savingKeys = Object.keys(params.data);
                    for (var i = 0; i < _savingKeys.length; i++) {
                        console.log('updating > '+_savingKeys[i]);

                        config[_savingKeys[i]] = params.data[_savingKeys[i]];
                    };
                    config.last_modified= moment().unix();

                    /// T
                    if (!params.data.profileProperties && params.data.flatProfileConfig) {

                        var props = writeProfileProperties(params.data.flatProfileConfig);
                        config.profileProperties = (unflatten(props, {delimiter:'__'}));
                    }

                    // console.log(config);
                    config.save(function (err) {
                      if (err) return handleError(err);
                        console.log('config saved');

                        Profile.get(config,function(profile) {
                            if (!config) {
                                console.log('no abridged config found');
                            } else {
                                console.log(profile);
                            }
                        });
                        
                        callback(config);
                    });
                    
                }
            });
        },
        getConfig: function(namespace, callback){

            if (namespace) {

            Config.findOne({name: namespace}).exec(function(err, config) {
                    if (!config) {
                        console.log('no config config found');

                    } else {

                        if (!config.profileProperties && config.flatProfileConfig) {
                            var props = writeProfileProperties(config.flatProfileConfig);
                            callback(unflatten(props, {delimiter:'__'})); // return settings in JSON format
                        } else {
                            callback(config.profileProperties);
                        }
                        
                    }
                });
            } else {

                Config.find(function(err, config) {
                    if (!config.length) {
                        console.log('no profile config found');
                    } else {
                        console.log(config.length+' config saved');
                        callback(config); // return settings in JSON format
                    }
                });
            }
                
        }
    }

    function writeProfileProperties(props) {

            var _propsKeys = Object.keys(props);
            for (var i = 0; i < _propsKeys.length; i++) {
                // console.log(_propsKeys[i].indexOf('enabled'));
                if  (_propsKeys[i].indexOf('enabled') > -1 || _propsKeys[i].indexOf('grouped') > -1 ) { 
                    delete props[_propsKeys[i]];
                }

            };

            props = unflatten(props, {delimiter:'$'});
            var newFlat = flatten(props, {delimiter: '___'}); 
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
module.exports = Config = mongoose.model('Config', schema);