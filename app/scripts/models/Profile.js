var mongoose = require('mongoose');
var Settings = require('./Settings');
var flatten = require('flat');
var moment = require('moment');
var schema = new mongoose.Schema({
    name: String,
    last_modified: Number,
    saved: Boolean,
    avatar: String,
    username: String,
    fetchedProfile: {},
    fetchedProfileFlat: {},
    props: {},
    profileConfig: {},
    postConfig: {}
});
schema.statics = {
        get: function(params, callback){

            var columns = params.columns;
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

                    var _savingKeys = Object.keys(params.data);
                    for (var i = 0; i < _savingKeys.length; i++) {
                        console.log('updating > '+_savingKeys);
                        profile[_savingKeys[i]] = params.data[_savingKeys[i]];
                    };
                    profile.last_modified= moment().unix();

                    profile.save(function (err) {
                      if (err) return handleError(err);
                        console.log('profile saved');
                        callback(profile);
                    });
                    
                }
            });
        }
    }
    // Return a Drop model based upon the defined schema
    // module.exports = Profile;
    // Return a Drop model based upon the defined schema
module.exports = Profile = mongoose.model('Profile', schema);