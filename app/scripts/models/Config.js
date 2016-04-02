var mongoose = require('mongoose');
var moment = require('moment');
var _ = require('lodash');


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
    update: function(options, callback){

        var query = { name: this.name},
            update = {last_modified : moment().format('X')},
            opts = {multi:false};
        update[options.type+'Config'] = options.data;

        //console.log(update);
        this.model('Config').update(query, update, opts, callback);

    }
});

module.exports = Config;
