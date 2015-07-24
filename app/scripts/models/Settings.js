var mongoose = require('mongoose'); 
;
var schema = new mongoose.Schema({
       name : String,
       last_modified: Number,
       saved: Boolean,
       virgin: Number,
       configs: {},
       networks: {}
});

schema.statics = {
	updateConfig : function (configs, callback) {


        Settings.update({
            configs: configs,
            last_modified: Date.now() / 1000 | 0
        }, function(err, settings) {
            Settings.findOne({
                name: 'settings'
            }, function(err, settings) {
                if (err) console.log(err)
                console.log('Settings Model > saved profile...');
                if (typeof callback == 'function') callback(settings);
            });
        });

    }
}

module.exports = Settings = mongoose.model('Settings', schema);