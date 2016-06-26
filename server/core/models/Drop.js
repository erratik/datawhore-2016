var mongoose = require('mongoose');
var _ = require('lodash');

// models
var Profile = require('./Profile');

// custom packages
var findValues = require('../../../app/scripts/custom-packages/prioritize').findValues;

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
var Drop = mongoose.createModel('Drop', {
    schema: {
        type: {type: String, index: true},
        last_modified: Number,
        content: {
            type:Object
        }
    },
    self: {
        findByName: function(name, cb) {
            return this.find({ name: name }, cb);
        },
        storeRain: function(params, callback) {
            //console.log(params);
            var _drop = new Profile({name: params.namespace}); // instantiated Profile

            // get the properties before saving the posts
            function rain(cb) {
                _drop.getProperties('post', function (props) {
                    //console.log(props);
                    cb(props);
                });
            }

            function applyProperties(posts, propertyMap) {
                var allData = [];
                _.forEach(posts, function(dataObj, cle){
                    var properties = {};
                    _.forEach(propertyMap, function(prop, key){

                        properties[prop.friendlyName] = {};

                        var post = dataObj;
                        var split = prop.path.split('__');
                        findValues(post, split, prop, properties);
                    });

                    allData.push(properties);
                });

                return allData;

            }

            rain(function(properties){
                //console.log(applyProperties(params.posts, properties));
                var posts = applyProperties(params.posts, properties);

                if (params.sample) {
                    // nothing will be saved, we're just designing a post here...
                    callback(_.first(posts));
                } else {

                    //Drop.save(posts);
                    //console.log('should be saving posts here');
                    callback(posts);
                }

            });





        }

    }
});

module.exports = Drop;



