var mongoose = require('mongoose');
var flatten = require('flat');
var unflatten = require('flat').unflatten;
var moment = require('moment');
var schema = new mongoose.Schema({
    name: String,
    last_modified: Number,
    avatar: String,
    username: String,
    postProperties: {},
    profileProperties: {}
});


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
            name: options.data.name || options.name // if not saving all, use the name set in updateConfig()
        };

        console.log('<---------- saveProfile()');

        //if (params.data.name) {
            // Profile.findOne({name: params.namespace}, function(err, profile) {
            Profile.findOne({name: params.name}).select().exec(function(err, profile) {
                if (!profile) {
                    console.log('abridged profile not saved, not found');
                    
                } else {
                    //
                    //console.log(params.data.profileProperties);
                    //console.log(params.type);

                    profile.last_modified = params.data.last_modified;

                    switch(params.type) {
                        case 'profile':
                            profile.profileProperties = params.data.profileProperties;
                            console.log('+++ profile  properties save');
                            break;
                        case 'post':
                            profile.postProperties = params.data.postProperties;
                            console.log('+++ post  properties save');
                            break;
                        default:
                            profile.avatar = params.data.avatar;
                            profile.username = params.data.username;
                            profile.profileProperties = params.data.profileProperties;
                            profile.postProperties = params.data.postProperties;
                            console.log('+++ full config properties save');

                    }

                    profile.save(function (err) {
                        if (err) return handleError(err);
                        console.log('+++ abridged profile saved');
                        //console.log('what am i saving in Profile.js?');
                        // console.log(profile);
                        callback(profile); // return settings in JSON format
                    });
                    
                }
            });
        //}
            
    }
};

module.exports = Profile = mongoose.model('Profile', schema);