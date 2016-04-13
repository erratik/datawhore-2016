var mongoose = require('mongoose');
var moment = require('moment');
var _ = require('lodash');

var assignValues = require('../../custom-packages/prioritize').assignValues;
var writeProperties = require('../../custom-packages/prioritize').writeProperties;

var Profile = require('./Profile');

// bootstrap mongoose, because syntax.
mongoose.createModel = function(name, options) {
    var schema = new mongoose.Schema(options.schema);
    for (key in options.self) {
        if (typeof options.self[key] !== 'function') continue;
        schema.statics[key] = options.self[key];
    }
    for (key in options) {
        if (typeof options[key] !== 'function') continue;
        schema.methods[key] = options[key];
    }
    return mongoose.model(name, schema);
};

// Define the model w/ pretty syntax!
var Config = mongoose.createModel('Config', {
    schema: {
        name: String,
        last_modified: Number,
        saved: Boolean,
        avatar: String,
        username: String,
        profileConfig: {},
        postConfig: {}
    },
    self: {
        findByName: function(name, cb) {
            return this.find({ name: name }, cb);
        }
    },
    update: function(options, cb){

        var query = { name: this.name},
            update = {last_modified : moment().format('X')},
            opts = {multi:false, upsert: true};
        update[options.type+'Config'] = (options.reset) ? assignValues(options.data) : options.data;
        var that = this.model('Config');

        this.model('Config').update(query, update, opts, function(err, saved){
            if (saved) {
                    // now i want to check if i have saved properties and write them over with writeProperties
                    that.findOne({name: query.name}, function(err, config){
                        var data = writeProperties(options.data);
                        if (config) {
                            var _profile = new Profile({name: query.name}); // instantiated Profile
                            _profile.update({
                                data: data,
                                type: options.type,
                                wipe: true
                            }, function(err, saved) {
                                if (saved) cb({config:update.profileConfig, properties: data});
                            });
                        } else {
                           cb(err);
                        }
                    });
            } else {
                console.log(err);
            }
        });

    }
});

Profile = mongoose.model('Profile', Profile);
module.exports = Config;
