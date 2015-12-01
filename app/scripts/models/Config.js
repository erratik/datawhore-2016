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
    profileConfig: {},
    profileProperties: {},
    postProperties: {},
    postConfig: {}
});

schema.statics = {
    get: function(params, callback){
        // this method gets all the config object,not just post or profile properties
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
                            // console.log(profile);
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
        // console.log(params);
        Config.findOne({name: params.namespace}, function(err, config) {
            if (config) {


                if (params.data.profileConfig) {
                    // if i got postConfig from the formData received, i'll copy it
                    var flatProfileConfig = JSON.parse(JSON.stringify(params.data.profileConfig));
                    params.data.flatProfileConfig = flatten(flattenConfig(flatProfileConfig), {delimiter: '$'});
                }

                if (params.data.postConfig) {
                    // if i got postConfig from the formData received, i'll copy it
                    var flatPostConfig = JSON.parse(JSON.stringify(params.data.postConfig));
                    params.data.flatPostConfig = flatten(flattenConfig(flatPostConfig), {delimiter: '$'});

                }

                // modify the config to have the updated content
                config.last_modified = moment().unix();
                var _savingKeys = Object.keys(params.data);
                for (var i = 0; i < _savingKeys.length; i++) {
                    console.log('updating > ' + _savingKeys[i]);

                    config[_savingKeys[i]] = params.data[_savingKeys[i]];
                }

                // todo: stop saving the properties in the config before saving the Profile model
                if (params.data.flatProfileConfig) {
                    var props = writeProfileProperties(params.data.flatProfileConfig);
                    config.profileProperties = unflatten(props, {delimiter: '__'});
                }

                if (params.data.flatPostConfig) {
                    var props = writeProfileProperties(params.data.flatPostConfig);
                    //console.log(props);
                    config.postProperties = unflatten(props, {delimiter: '__'});
                }

                //console.log(config.profileProperties);
                //console.log('--------------------------------------------------------');
                //console.log(config.postProperties);

                // saving config
                config.save(function (err) {
                    if (err) return handleError(err);
                    console.log('config saved');

                    // saving the abridged profile, Profile.js
                    Profile.saveProfile({data: config, type: params.type}, function (profile) {
                        if (profile) {
                           // console.log(profile);
                        }
                    });

                    callback(config);
                });

            } else {
                console.log('(update) no ' + params.namespace + ' config found');
            }
        });
    },
    updateConfig: function(params, callback){

        var config = {};

        config.name = params.namespace;

        config[params.type+'Properties'] = params.data[params.type+'Properties'];

        console.log('<---------- updateConfig( ' + params.type+ ' )');
        console.log(config);

        // saving the abridged profile, Profile.js
        Profile.saveProfile({data: config, type: params.type}, function (config) {
            if (config[params.type+'Properties']) {
                //console.log(profile);
                console.log(params.type + ' properties saved');
            }
            callback(config[params.type+'Properties']);
        });

    },
    getProperties: function(namespace, callback){
        var params = {
            namespace: options.namespace,
            configType: options.configType
        };

        if (params.namespace) {
                Profile.findOne({name: params.namespace}).exec(function(err, config) {
                    if (!config) {
                        console.log('no config config found');

                    } else {

                        if (params.configType == 'profile') {
                            if (!config.profileProperties && config.flatProfileConfig) {
                                var props = writeProfileProperties(config.flatProfileConfig);
                                callback(unflatten(props, {delimiter:'__'})); // return settings in JSON format
                            } else {
                                callback(config.profileProperties);
                            }
                        } else {
                            if (!config.postProperties && config.flatPostConfig) {
                                var props = writeProfileProperties(config.flatPostConfig);
                                callback(unflatten(props, {delimiter:'__'})); // return settings in JSON format
                            } else {
                                callback(config.postProperties);
                            }
                        }

                        // callback(configProperties);
                        
                    }
                });
        } else {

            if (params.configType == 'profile') {
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
};

function flattenConfig(flatConfig) {
    //console.log(flatConfig);
    var _profileKeys = Object.keys(flatConfig);
    for (var i = 0; i < _profileKeys.length; i++) {
        var attribute = flatConfig[_profileKeys[i]];
        //console.log(attribute);
        if (typeof attribute.grouped == 'boolean' && !attribute.grouped) {
            if (typeof attribute.content != 'undefined' && !attribute.content.enabled) 
                delete flatConfig[_profileKeys[i]];
        } else if (attribute.content !== undefined) {
            //console.log(_profileKeys[i]);
            //console.log(attribute);
            var _attributeKeys = Object.keys(attribute.content);
            for (var j = 0; j < _attributeKeys.length; j++) {
                attribute = flatConfig[_profileKeys[i]].content[_attributeKeys[j]];
                if (typeof attribute.content != 'undefined' && !attribute.content.enabled) 
                    delete flatConfig[_profileKeys[i]].content[_attributeKeys[j]];

            }
            if (!Object.keys(flatConfig[_profileKeys[i]].content).length) 
                delete flatConfig[_profileKeys[i]];
        }
    };
    return flatConfig;
}
function writeProfileProperties(props) {

        var _propsKeys = Object.keys(props);
        for (var i = 0; i < _propsKeys.length; i++) {
             //console.log(_propsKeys[i]);
             //console.log('not "enabled"? '+ (_propsKeys[i].indexOf('enabled')> -1));
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

var Profile = mongoose.model('Profile', Profile);
module.exports = Config = mongoose.model('Config', schema);