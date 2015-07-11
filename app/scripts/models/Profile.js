
var mongoose = require('mongoose'); 

var schema = new mongoose.Schema({
       name : String,
       last_modified: Number,
       saved: Boolean,
       avatar: String,
       profile: {}
});


schema.statics = {
	updateProfile : function (params, callback) {
		Profile.findOne({
	            name: params.namespace
	    }, function(err, profile) {

	        if (!profile) {

	            
				var savedProfile = {
	                name: params.namespace,
	                last_modified: Date.now() / 1000 | 0,
	                profile: params.profile,
	                avatar: params.avatar,
	                saved: true
	            };

	            Profile.create(savedProfile, function(err, profile) {
	                if (!err) {
	                    console.log(' ');
	                    console.log('Profile Model > ... creating profile for ' + params.namespace);
	                    console.log(' ');

	                    callback(profile);
	                }
	            });
	        } else {
	            console.log(' ');
	            console.log('Profile Model > ... saving profile for ' + params.namespace);
	            console.log(' ');
	            profile.profile = params.profile;
	            profile.saved = true;
	            profile.avatar = params.avatar;
	            profile.last_modified = Date.now() / 1000 | 0;
	            profile.save(function(err) {
	            	if (!err) {
	            		console.log(profile);
						callback(profile);
					} else {
						console.log(err);
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