var mongoose = require('mongoose');;
var schema = new mongoose.Schema({
    name: String,
    last_modified: Number,
    saved: Boolean,
    virgin: Number,
    configs: {},
    networks: {}
});
schema.statics = {
    updateConfig: function(configs, callback) {
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
    },
    updating: function(params, callback) {


        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) console.log(err)

            var updatedSettings = {
              configs: params.configs || settings.configs,
              networks: params.networks || settings.networks,
              virgin: Object.keys(settings.networks).length,
              last_modified: Date.now() / 1000 | 0
            };


            Settings.update(updatedSettings, function(err, settings) {
                Settings.findOne({
                    name: 'settings'
                }, function(err, settings) {
                    if (err) console.log(err)
                    console.log('Settings Model > updated settings...');
                    if (typeof callback == 'function') callback(settings);
                });
            });

        });

    },
    getNetworkConfigs: function(params, callback){

        if (params.namespace) {
            Settings.findOne('settings', function(err, settings) {
                if (!settings) {
                    console.log('no settings found');
                } else {
                    callback(settings.networks[params.namespace]); // return settings in JSON format
                    
                }
            });
        } else {

            Settings.find(function(err, settings) {
                if (!settings.length) {
                    console.log('no settings saved');
                } else {
                    // console.log(settings[0].networks)

                    callback(settings[0].networks); // return settings in JSON format
                }
            });
        }
            
    }
}
module.exports = Settings = mongoose.model('Settings', schema);