var mongoose = require('mongoose');
var moment = require('moment');
var _ = require('lodash');

var assignValues = require('../../../app/scripts/custom-packages/prioritize').assignValues;
var writeProperties = require('../../../app/scripts/custom-packages/prioritize').writeProperties;

var Profile = require('./Profile');


// bootstrap mongoose, because syntax.
mongoose.createModel = function (name, options) {
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
        findByName: function (name, cb) {
            return this.find({name: name}, cb);
        },
        getOauthSettings: function (name, cb) {
            // console.log(this.find({ name: name }));
            return this.find({name: name}, 'settings', cb);
        },
        getAll: function (cb) {

            return this.find({}, cb);
        }
    },
    resetConfig: function (options, cb) {
        console.log('resetting ' + options.type + ' config');
        console.log(options);

        this.updateConfigModel({
            data: options.data,
            type: options.type,
            reset: true
        }, function (config) {
            cb(config);
        });

    },

    updateConfigModel: function (options, cb) {

        var query = {name: this.name},
            update = {last_modified: moment().format('X')},
            opts = {multi: false, upsert: true},
            isConfig = typeof options.reset == 'boolean';
        var that = this.model('Config');
        var updateFetchedProperties = options.reset;

        if (isConfig) {
            // I don't want the "reset" to be used yet, I'lls end it as an option or something.
            // so for now, "updateFetchedProperties (reset)" => "update fetched properties"
            update[options.type + 'Config'] = (updateFetchedProperties) ? assignValues(options.data) : options.data;

        } else if (options.type == 'core') {
            update.settings = {};
            _.each(options.data, function (obj, key) {
                update.settings[key] = {};
                _.each(obj, function (settings, k) {
                    //return settings;
                    update.settings[key][settings.key] = {
                        value: settings.value,
                        label: settings.label
                    };

                });
            });
            update.connected = true;

        } else {
            // create the settings object by map the "type",
            // which is actually a mapped object to create ('settings.oauth')
            // with the data the keys with values and labels
            // console.log(options.data);
            var data = [];
            data.push(options.data);
            var updatedObj = _.zipObjectDeep([options.type], data);
            _.merge(update, updatedObj);
        }

        // console.log('-> going to update config entry with:');
        // console.log(update);
        // cb(update);

        this.model('Config').findOne({name: query.name}, function (err, currentConfig) {
            var data = writeProperties(options.data);

            /*console.log('-------- (current raw) -----------');
            console.log(currentConfig[options.type + 'Config']);
            console.log('-------- (current truthy) -----------');
            console.log(writeProperties(currentConfig[options.type + 'Config']));*/

            /*var incompleteAttributes = _.filter(currentConfig[options.type + 'Config'], function(o){
             if ( _.isNil(o.content))
             return o;
             });
             console.log('-------- (current incomplete attributes) -----------');
             console.log(incompleteAttributes);*/

            var enabledAttributes = {};
            gatherEnabled(currentConfig[options.type + 'Config'], enabledAttributes);
            function gatherEnabled(object, newObj) {

                _.filter(object, function (attribute, key) {

                    if (typeof object[key].grouped == 'boolean' && !object[key].grouped && object[key].content.enabled) {
                        // return attribute;
                        newObj[key] = attribute;
                    } else if (object[key].grouped) {
                        // comments: { content: { count: [Object] }, grouped: true }
                        var nestedObj = object[key]; // { content: { count: { enabled: true, value: 5, label: 'count'  }, grouped: true }
                        recur(attribute.content, nestedObj.content);
                        function recur(content, newNestedObj) {
                            // newNestedObj => { enabled: true, value: 5, label: 'count'  }
                            // console.log(content, newNestedObj);
                            _.filter(content, function (childAttr, k) {
                                if (_.isBoolean(newNestedObj[k].grouped)) {
                                    // todo: this is super untested, haha
                                    // console.log('this should be a recursive...');
                                    // console.log(key,'=>', k, ':', childAttr);
                                    recur(childAttr.content, newNestedObj[k].content);
                                } else if (childAttr.enabled) {
                                    newObj[key] = {content: {}, grouped: true};
                                    newObj[key].content[k] = newNestedObj[k];
                                }
                            });
                        };
                    }
                });
            }


            if (_.size(data)) {

                console.log('--->  found data to enable in this update  ---------');
                console.log(data);

            } else if (_.size(enabledAttributes)) {
                console.log('---> no data to enable in this update ');

                var existingKeys = _.keys(enabledAttributes);
                // console.log('---------- result if the attributes are already enabled ---------');
                var _update = _.merge(enabledAttributes, _.omit(currentConfig[options.type + 'Config'], existingKeys));

                update[options.type + 'Config'] = _update;
                data = writeProperties(_update);

            }


            that.update(query, update, opts, function (err, modelUpdated) {
                if (modelUpdated) {

                    // check to see if this data is a config for post or profile
                    if (isConfig) {
                        // if it's a config, update the profile model too
                        var _profile = new Profile({name: query.name}); // instantiated Profile
                        _profile.update({
                            data: data,
                            type: options.type,
                            updateFromConfig: true
                        }, function (err, profileSaved) {
                            if (profileSaved) cb({config: update[options.type + 'Config'], properties: data});
                        });
                    } else if (!isConfig && modelUpdated) {
                        cb(update);
                    } else if (err || modelUpdated) {
                        var msg = err ? err : modelUpdated;
                        cb(msg);
                    }
                } else {
                    cb(err);
                }
            });
        });

    },
    connect: function (cb) {

        var query = {name: this.name},
            update = {
                last_modified: moment().format('X')
            },
            opts = {multi: false, upsert: true};

        this.model('Config').updateConfigModel(query, update, opts, function (err, saved) {
            console.log(update);

            if (saved) {
                cb(update);
            } else if (err) {
                cb(err);
            }
        });

    }
});


Profile = mongoose.model('Profile', Profile);
module.exports = Config;