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
        connected: Boolean,
        settings: {},
        profileConfig: {},
        postConfig: {},
        avatar: String,
        username: String
    },
    self: {
        findByName: function(name, cb) {
            return this.find({ name: name }, cb);
        },
        getAll: function(cb) {
            return this.find({}, cb);
        }
    },
    update: function(options, cb) {

        var query = {name: this.name},
            update = {last_modified: moment().format('X')},
            opts = {multi: false, upsert: true},
            isConfig = typeof options.reset == 'boolean';

        if (isConfig) {
            update[options.type + 'Config'] = (options.reset) ? assignValues(options.data) : options.data;
            var that = this.model('Config');
        } else if (options.type == 'core') {
            update.settings = {};
            _.each(options.data, function(obj, key){

                update.settings[key] = {};

                _.each(obj, function(settings, k){
                    //return settings;
                    update.settings[key][settings.key] = {
                        value: settings.value,
                        label: settings.label
                    };

                });

            });
        } else if (options.type == 'network') {

        }
        //console.log(update);
        //cb(update);

        this.model('Config').update(query, update, opts, function (err, saved) {
            console.log(update);

            if (isConfig) {
                that.findOne({name: query.name}, function (err, config) {
                    var data = writeProperties(options.data);
                    //console.log(data);
                    if (config) {
                        var _profile = new Profile({name: query.name}); // instantiated Profile
                        _profile.update({
                            data: data,
                            type: options.type,
                            wipe: true
                        }, function (err, saved) {
                            if (saved) cb({config: update[options.type + 'Config'], properties: data});
                        });
                    } else {
                        cb(err);
                    }
                });
            } else if (!isConfig && saved) {
                cb(update);
            } else if (err || saved) {
                var msg = err ? err : saved;
                cb(msg);
            }
        });

    }
});

Profile = mongoose.model('Profile', Profile);
module.exports = Config;
