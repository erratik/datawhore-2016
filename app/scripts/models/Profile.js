var mongoose = require('mongoose');
var _ = require('lodash');
var flatten = require('flat');
var unflatten = require('flat').unflatten;
var moment = require('moment');
var schema = new mongoose.Schema({
    name: String,
    last_modified: Number,
    avatar: String,
    username: String,
    postProperties: {},
    profileProperties: {}
});
var assignValues = require('../custom-packages/prioritize').assignValues;


schema.statics = {
    get: function(config, callback){

        if (config.name) {
            // Profile.findOne({name: params.namespace}, function(err, profile) {
        Profile.findOne({name: config.name}).select().exec(function(err, profile) {
                if (!profile) {
                    console.log('no abridged profile found');
                    Profile.create(config, function(err, profile) {
                        if (!err) {
                            console.log('... abridged profile created');
                            callback(profile);
                        }
                    });
                } else {
                    console.log('************* profile and post properties gotten');
                    //console.log(profile);
                    callback(profile); // return settings in JSON format
                    
                }
            });
        }
            
    },
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
    saveProfile: function(options, callback){
        var params = {
            data: options.data,
            type: options.type,
            name: options.data.name || options.name // if not saving all, use the name set in updateConfig()
        };

        console.log('<---------- saveProfile()');

        //if (params.data.name) {
            // Profile.findOne({name: params.namespace}, function(err, profile) {
            Profile.findOne({name: params.name}).select().exec(function(err, profile) {
                if (!profile) {
                    console.log('abridged profile not saved, not found');
                    
                } else {
                    //
                    //console.log(params.data.profileProperties);
                    //console.log(params.type);

                    profile.last_modified = params.data.last_modified;

                    //console.log(makeNetworkProperties(params.data.postConfig));

                    switch(params.type) {
                        case 'profile':
                            // todo: need to write the properties here, with the params.data.postConfig that was sent...
                            profile.profileProperties = params.data.profileProperties;
                            console.log('+++ profile  properties saved');
                            break;
                        case 'post':
                            // todo: need to write the properties here, with the params.data.profileConfig that was sent...
                            profile.postProperties = params.data.postProperties;
                            console.log('+++ post  properties saved');
                            break;
                        case 'all':
                            // todo: need to write the properties here, with the params.data.profileConfig that was sent...
                            profile.postProperties = params.data.postProperties;
                            profile.profileProperties = params.data.profileProperties;
                            profile.avatar = params.data.avatar;
                            profile.username = params.data.username;
                            console.log('+++ full profile propeties saved');
                            break;
                        default:
                            profile.avatar = params.data.avatar;
                            profile.username = params.data.username;
                            //profile.profileProperties = params.data.profileProperties;
                            //profile.postProperties = params.data.postProperties;
                            console.log('+++ avatar and username saved in profile properties for '+params.name);

                    }

                    profile.save(function (err) {
                        if (err) return handleError(err);
                        console.log('+++ abridged profile saved');
                        //console.log('what am i saving in Profile.js?');
                        // console.log(profile);
                        callback(profile); // return settings in JSON format
                    });
                    
                }
            });
        //}
            
    }
};

function makeNetworkProperties(props) {

    var properties = _.filter(props, {content: { 'enabled':  true }});
    var childProperties = _.filter(props, {grouped: true}, function( property) {
        _.filter(property, {content: { 'enabled':  true }}, function(content) {
            if (typeof content.value == 'object') {
                return content;
            }
        });

        //_.pluck(_.filter(property, {content: { 'enabled':  true }}), 'value');
    });

    console.log(_.pluck(childProperties, 'content'));
    console.log(childProperties);

    return properties;

}

module.exports = Profile = mongoose.model('Profile', schema);