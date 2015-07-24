var mongoose = require('mongoose'); 

var Profiles = mongoose.model('Profiles', {
       name : String,
       last_modified: Number,
       saved: Boolean,
       profile: Array
});

// Return a Drop model based upon the defined schema
module.exports = Profiles;