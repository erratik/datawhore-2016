var mongoose = require('mongoose');
var moment = require('moment');
var _ = require('lodash');

var assignValues = require('../custom-packages/prioritize').assignValues;
var writeProperties = require('../custom-packages/prioritize').writeProperties;

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
            opts = {multi:false};
        update[options.type+'Config'] = (options.reset) ? assignValues(options.data) : options.data;
        var that = this.model('Config');

        this.model('Config').update(query, update, opts, function(err, numAffected){
            if (numAffected) {

                    // now i want to check if i have saved properties and write them over with writeProperties
                    that.findOne({name: query.name}, function(err, config){

                        //if (typeof config.virgin == 'undefined') {
                            var _profile = new Profile({name: query.name}); // instantiated Profile
                            _profile.update({
                                data: writeProperties(options.data),
                                type: options.type
                            }, function(err, properties) {

                                console.log(properties);

                                cb({config:update.profileConfig, properties:  writeProperties(options.data)});
                            });


                        //}
                    });
            } else {
                console.log(err);
            }
        });

    }
});

Profile = mongoose.model('Profile', Profile);

module.exports = Config;
