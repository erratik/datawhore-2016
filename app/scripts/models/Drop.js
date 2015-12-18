var mongoose = require('mongoose');
var _ = require('lodash');

// models
var Config = require('./Config');

// custom packages
var assignValues = require('../custom-packages/prioritize').assignValues;
var writeProperties = require('../custom-packages/prioritize').writeProperties;
var findValues = require('../custom-packages/prioritize').findValues;

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

        //setting up to be able to map the post values with my selected and name properties

        Config.get({namespace: params.namespace},function(config) {
            if (!config) {
                console.log('no post properties found');
            } else {

                Profile.get(config,function(profile) {
                    if (!profile) {
                        console.log('no abridged config found');
                    } else {
                        // console.log(profile);
                        // todo: add type param

                        //var propertyMap = profile.postProperties; // return settings in JSON format
                        var posts = applyProperties(params.posts, config, profile.postProperties);

                        if (params.sample) {
                            // nothing will be saved, we're just designing a post here...
                            callback(_.first(posts));
                        } else {

                            //Drop.save(posts);
                            console.log('should be saving posts here');
                            callback(posts);
                        }
                    }
                });
            }
        });

    }
};

function applyProperties(posts, config, propertyMap) {

    //var newPostConfig = assignValues(_.first(posts));
    //
    //var appliedPostConfig = _.merge(newPostConfig, config.postConfig);
    //var propertyMap = writeProperties(appliedPostConfig);
    //
    ////return trimData(posts, propertyMap);

    console.log(propertyMap);

    var allData = [];
    _.forEach(posts, function(dataObj, cle){
        var properties = {};
        _.forEach(propertyMap, function(prop, key){

            properties[prop.friendlyName] = {};
            //console.log('- - - - - - - - - - -');
            //console.log(prop.path.split('__'));
            var post = dataObj;
            var split = prop.path.split('__');
            findValues(post, split, prop, properties);
        });

        allData.push(properties);
    });

    return allData;

}




module.exports = Drop = mongoose.model('Drop', schema);