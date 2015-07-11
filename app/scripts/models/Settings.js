var mongoose = require('mongoose'); 
;
var Settings = mongoose.model('Settings', {
       name : String,
       last_modified: Number,
       saved: Boolean,
       virgin: Number,
       configs: {},
       networks: {}
});

// Return a Drop model based upon the defined schema
module.exports = Settings;