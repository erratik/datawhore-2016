var mongoose = require('mongoose'); 
;
var Settings = mongoose.model('Settings', {
       name : String,
       last_modified: Number,
       saved: Boolean,
       configs: {virgin: Boolean},
       networks: Array
});

// Return a Drop model based upon the defined schema
module.exports = Settings;