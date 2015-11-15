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
                    callback(profile); // return settings in JSON format
                    
                }
            });
        }
            
    },
    save: function(config, callback){

        if (config.name) {
            // Profile.findOne({name: params.namespace}, function(err, profile) {
        Profile.findOne({name: config.name}).select().exec(function(err, profile) {
                if (!profile) {
                    console.log('abridged profile not saved, not found');
                    
                } else {

                    profile = config;
                    profile.save(function (err) {
                      if (err) return handleError(err);
                        console.log('abridged profile created');
                        callback(profile); // return settings in JSON format
                    });
                    
                }
            });
        }
            
    }
}

module.exports = Profile = mongoose.model('Profile', schema);