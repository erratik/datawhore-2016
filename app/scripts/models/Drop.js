var mongoose = require('mongoose');
var _ = require('lodash');

// models
var Config = require('./Config');

// custom packages
var assignValues = require('../custom-packages/prioritize').assignValues;
var writeProperties = require('../custom-packages/prioritize').writeProperties;

var schema = new mongoose.Schema({
    type: {type: String, index: true},
    last_modified: Number,
    content: {
        type:Object
    }
}, {strict: false});



schema.statics = {
    //getAll: function(callback){
    //
    //   Profile.find(function(err, profile) {
    //           if (!profiles.length) {
    //               console.log('no abridged profiles saved');
    //           } else {
    //               console.log(profiles.length+' abridged profiles saved');
    //               callback(profiles); // return settings in JSON format
    //           }
    //   });
    //
    //},
    storeRain: function(options, callback){
        var params = {
            posts: options.posts,
            namespace: options.namespace,
            sample: options.sample
        };

        console.log('<---------- save '+params.namespace+' posts ('+params.posts.length+'), sample? '+ params.sample);

        if (params.sample) {
            var newPostConfig = assignValues(params.posts[0]);

            Config.get({namespace: params.namespace},function(config) {
                if (!config) {
                    console.log('no post properties found');
                } else {
                     var appliedPostConfig = _.merge(newPostConfig, config.postConfig);
                    //profile.postProperties;
                    //console.log(appliedPostConfig);
                    console.log(writeProperties(appliedPostConfig));

                    //callback(config); // return settings in JSON format
                }
            });
            callback(params.posts[0]);
        } else {


            console.log();
            callback(params.posts);
        }

    }
};

module.exports = Drop = mongoose.model('Drop', schema);