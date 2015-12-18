var mongoose = require('mongoose');
var _ = require('lodash');
var Profile = require('./Profile');


var schema = new mongoose.Schema({
    name: String,
    last_modified: Number,
    saved: Boolean,
    avatar: String,
    username: String,
    profileConfig: {},
    postConfig: {}
});

schema.statics = {
    get: function(params, callback){
        // this method gets all the config object,not just post or profile properties
        //var columns = params.columns;
        // console.log(params);
        if (params.namespace) {
        //Config.findOne({name: params.namespace}).select().exec(function(err, config) {
        Config.findOne({name: params.namespace}).exec(function(err, config) {
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
                            // todo: add type param
                            config.profileProperties = profile.profileProperties;
                            config.postProperties = profile.postProperties;
                            callback(config); // return settings in JSON format
                        }
                    });
                    
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
        //console.log(params);
        Config.findOne({name: params.namespace}, function(err, config) {
            if (config) {

                // modify the config to have the updated content
                config.last_modified = Date.now() / 1000 | 0;
                console.log('updating > ' + params.type+ 'Config');
                config[params.type+'Config'] = params.data[params.type+'Config'];

                // saving config
                config.save(function (err) {
                    if (err) return handleError(err);
                    console.log('config saved');

                    // saving the abridged profile, Profile.js
                    Profile.saveProfile({data: config, type: params.type}, function (profile) {
                        if (profile) {


                            console.log(_.merge(config,profile));

                            callback(_.merge(config,profile));
                        } else {

                        }
                    });


                });

            } else {
                console.log('(update) no ' + params.namespace + ' config found');
            }
        });
    }
};


var Profile = mongoose.model('Profile', Profile);
module.exports = Config = mongoose.model('Config', schema);