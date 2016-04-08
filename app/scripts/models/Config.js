var mongoose = require('mongoose');
var moment = require('moment');
var _ = require('lodash');

var assignValues = require('../custom-packages/prioritize').assignValues;
var writeProperties = require('../custom-packages/prioritize').writeProperties;


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
            opts = {multi:false};
        update[options.type+'Config'] = (options.reset) ? assignValues(options.data) : options.data;
        var that = this.model('Config');

        //cb(writeProperties(options.data));
        //cb(options.data);
        this.model('Config').update(query, update, opts, function(err, numAffected){
            if (numAffected) {
                    cb(update.profileConfig);

            } else {
                console.log(err);
            }
        });

    }
});

module.exports = Config;
