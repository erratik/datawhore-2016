var mongoose = require('mongoose');
var Settings = require('./Settings');
var flatten = require('flat');
var schema = new mongoose.Schema({
    name: String,
    last_modified: Number,
    saved: Boolean,
    avatar: String,
    username: String,
    fetchedProfile: {},
    props: {}
});
schema.statics = {
        updateProfile: function(params, callback) {
            Profile.findOne({
                name: params.namespace
            }, function(err, profile) {

                Settings.findOne({
                    name: 'settings'
                }, function(err, settings) {

                    var savedProfile = {
                        name: params.namespace,
                        last_modified: Date.now() / 1000 | 0,
                        fetchedProfile: params.profile,
                        avatar: params.avatar,
                        username: params.username,
                        saved: true
                    };
                    if (!profile) {
                        Profile.create(savedProfile, function(err, profile) {
                            if (!err) {
                                console.log(' ');
                                console.log('Profile Model > ... creating profile for ' + params.namespace);
                                console.log(' ');

                                settings.configs[params.namespace]['profile'] = true;
                                var data = {
                                    config: settings.configs[params.namespace],
                                    profile: profile
                                };
                                Settings.updateConfig(settings.configs);
                                console.log('API > ' + params.namespace + ' > saved profile...');
                                callback(data);
                            }
                        });
                    } else {

                        profile.last_modified = Date.now() / 1000 | 0;
                        profile.fetchedProfile = savedProfile.fetchedProfile;
                        profile.avatar = savedProfile.avatar;

                        profile.save(function(err) {
                            if (!err) {
                                console.log(' ');
                                console.log('Profile Model > ... saving profile for ' + params.namespace);
                                console.log(' ');

                                settings.configs[params.namespace]['profile'] = true;
                                var data = {
                                    config: settings.configs[params.namespace],
                                    profile: profile
                                };
                                Settings.updateConfig(settings.configs);

                                console.log('Profile Model > callback to /api/profiles/' +params.namespace, profile);

                        // if (typeof profiles[i]['fetchedProfile'] == 'object') {
                                data.profile.fetchedProfile = flatten(data.profile['fetchedProfile'], {delimiter: '__'});
                        // }
                                callback(data);
                            } else {
                                console.log(err);
                            }
                        });

                    }
                });
            });
        },
        nominateProfileProperties: function(params, callback) {
            Profile.findOne({
                name: params.namespace
            }, function(err, profile) {
                if (!profile) {
                    console.log('Profile Model > !!!! error, profile not found');
                } else {
                //             console.log(' ');
                //     console.log('Profile Model > listing found profile');
                            console.log(' ');
                    profile.last_modified = Date.now() / 1000 | 0;
                    var receivedProps = params.data;
                    var newProps = Object.keys(receivedProps);
                    console.log('Profile Model > receivedProps');
                            console.log(' ');
                    console.log(receivedProps);
                    profile.props = {};
                    for (var i = 0; i < newProps.length; i++) {
                        if (!params.enabling || receivedProps[newProps[i]].enabled) {
                            profile.props[newProps[i]] = receivedProps[newProps[i]];
                            // console.log('saved > ' +newProps[i] );
                            // console.log(profile.props[newProps[i]]);
                        }
                    };
                            console.log(' ');
                            console.log('Profile Model > ... nominating profile properties for ' + params.namespace);
                            console.log(' ');
                            console.log( profile.props);

                    Profile.update({name: params.namespace}, {props: profile.props}, {overwrite: true}, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(' ');
                            console.log('Profile Model > ... attempted to save properties for ' + params.namespace);
                            console.log(' ');
                            console.log(profile);
                            // callback(flatten(profile, {
                            //     delimiter: '__'
                            // }));

                            callback(profile);
                        }
                    });
                }
            });
        }
    }
    // Return a Drop model based upon the defined schema
    // module.exports = Profile;
    // Return a Drop model based upon the defined schema
module.exports = Profile = mongoose.model('Profile', schema);