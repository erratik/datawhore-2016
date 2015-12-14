var mongoose = require('mongoose');
var _ = require('lodash');

var writeProperties = require('../custom-packages/prioritize').writeProperties;

var schema = new mongoose.Schema({
    name: String,
    last_modified: Number,
    avatar: String,
    username: String,
    postProperties: {},
    profileProperties: {},
    post: {
        type:Object,
        entities: {}
    }
}, {strict: false});


schema.statics = {
    get: function(config, callback){

        if (config.name) {
            // Profile.findOne({name: params.namespace}, function(err, profile) {
        Profile.findOne({name: config.name}).select().exec(function(err, profile) {
                if (!profile) {
                    console.log('no abridged profile found');
                    Profile.create(config, function(err, profile) {
                        if (!err) {
                            console.log('... abridged profile created');
                            callback(profile);
                        }
                    });
                } else {
                    console.log('************* profile and post properties gotten');
                    //console.log(profile);
                    callback(profile); // return settings in JSON format
                    
                }
            });
        }
            
    },
    //getAll: function(callback){
    //
    //   Profile.find(function(err, profile) {
    //           if (!profiles.length) {
    //               console.log('no abridged profiles saved');
    //           } else {
    //               console.log(profiles.length+' abridged profiles saved');
    //               callback(profiles); // return settings in JSON format
    //           }
    //   });
    //
    //},
    saveProfile: function(options, callback){
        var params = {
            data: options.data,
            type: options.type,
            name: options.data.name || options.name, // if not saving all, use the name set in updateConfig(),
            updating: options.updating
        };

        console.log('<---------- save '+params.type);

        //if (params.data.name) {
            // Profile.findOne({name: params.namespace}, function(err, profile) {
            Profile.findOne({name: params.name}).select().exec(function(err, profile) {
                if (!profile) {
                    console.log('abridged profile not saved, not found');
                    
                } else {
                    //

                    profile.last_modified = params.data.last_modified;

                    switch(params.type) {
                        case 'all':
                            profile.profileProperties = writeProperties(params.data.postConfig, profile.profileProperties);
                            profile.profileProperties = writeProperties(params.data.profileConfig, profile.postProperties);
                            profile.avatar = params.data.avatar;
                            profile.username = params.data.username;
                            console.log('+++ full profile propeties saving...');
                            break;
                        case 'profile':
                            profile.profileProperties = params.updating ? params.data : writeProperties(params.data.profileConfig, profile.profileProperties);
                            console.log('+++ profile  properties saved');
                            break;
                        case 'post':
                            //console.log(params.updating);
                            //console.log(params.data);
                            profile.postProperties = params.updating ? params.data : writeProperties(params.data.postConfig, profile.postProperties);
                            profile.post = profile.postProperties;
                            console.log('+++ post  properties saved');
                            break;
                        default:
                            profile.avatar = params.data.avatar;
                            profile.username = params.data.username;
                            console.log('+++ avatar and username saved in profile properties for '+params.name);

                    }


                    profile.save(function (err) {
                        if (err) return handleError(err);
                        console.log('+++ abridged profile saved');
                        if (params.updating) {
                            callback(profile[params.type+'Properties'])
                        } else {
                            callback(profile); // return settings in JSON format
                        }
                    });
                }
            });
        //}
            
    }
};


module.exports = Profile = mongoose.model('Profile', schema);