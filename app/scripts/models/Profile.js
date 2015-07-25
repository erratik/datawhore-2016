var mongoose = require('mongoose');
var flatten = require('flat');
var schema = new mongoose.Schema({
    name: String,
    last_modified: Number,
    saved: Boolean,
    avatar: String,
    username: String,
    profile: {},
    props: {}
});
schema.statics = {
        updateProfile: function(params, callback) {
            Profile.findOne({
                name: params.namespace
            }, function(err, profile) {

                var savedProfile = {
                    name: params.namespace,
                    last_modified: Date.now() / 1000 | 0,
                    profile: params.profile,
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
                            var data = {
                                configs: params.configs,
                                profiles: params.profiles
                            };
                            data.profiles[params.namespace] = profile;
                            params.configs[params.namespace]['profile'] = true;
                            Settings.updateConfig(params.configs);
                            console.log('API > ' + params.namespace + ' > saved profile...');
                            callback(data);
                        }
                    });
                } else {
                    console.log(' ');
                    console.log('Profile Model > ... saving profile for ' + params.namespace);
                    console.log(' ');
                    profile = savedProfile;
                    profile.save(function(err) {
                        if (!err) {
                            var data = {
                                configs: params.configs,
                                profiles: params.profiles
                            };
                            data.profiles[params.namespace] = profile;
                            params.configs[params.namespace]['profile'] = true;
                            Settings.updateConfig(params.configs);
                            callback(data);
                        } else {
                            console.log(err);
                        }
                    });
                }
            });
        },
        nominateProfileProperties: function(params, callback) {

            Profile.findOne({
                name: params.namespace
            }, function(err, profile) {
                if (!profile) {
                	console.log('Profile Model > !!!! error, profile not found');
                } else {


                	console.log('Profile Model > listing found profile');
                    profile.last_modified = Date.now() / 1000 | 0;
                    // console.log(params.data);
            		var newProps = Object.keys(params.data);
                	if (typeof profile.props == 'undefined') profile.props = {};
                    for (var i = 0; i < newProps.length; i++) {
                    	if (params.data[newProps[i]].enabled) {
                    		profile.props[newProps[i]] = params.data[newProps[i]];
                    		// console.log('saved > ' +newProps[i] );
                    		// console.log(profile.props[newProps[i]]);
                    	}

                    };

					Profile.update({name:params.namespace}, {props: profile.props}, {overwrite: true}, function(err){
						if (err) {
							console.log(err);
						} else {

		                    console.log(' ');
		                    console.log('Profile Model > ... nominating profile properties for ' + params.namespace);
		                    console.log(' ');
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