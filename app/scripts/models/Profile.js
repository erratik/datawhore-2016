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
var Profile = mongoose.createModel('Profile', {
    schema: {
        name: String,
        last_modified: Number,
        avatar: String,
        username: String,
        postProperties: {},
        profileProperties: {},
        post: {
            type:Object,
            entities: {}
        }
    },
    self: {
        findByName: function(name, cb) {
            return this.find({ name: name }, cb);
        }
    },
    getProperties: function(type, callback) {
         return this.model('Profile').find({ name: this.name }, function(err, profile){
             //console.log(profile);
             callback(profile[0][type+'Properties']);
         });
    },
    update: function(options, callback){

        var query = { name: this.name},
            update = {last_modified : moment().format('X')},
            opts = {multi:false};
        update[options.type+'Properties'] = options.data;

        //console.log(update);
        //console.log('[model][Profile] update');
        this.model('Profile').update(query, update, opts, callback);

    }

});

module.exports = Profile;