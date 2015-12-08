var mongoose = require('mongoose');
var _ = require('lodash');

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

        console.log('<---------- save '+params.type);

        //if (params.data.name) {
            // Profile.findOne({name: params.namespace}, function(err, profile) {
            Profile.findOne({name: params.name}).select().exec(function(err, profile) {
                if (!profile) {
                    console.log('abridged profile not saved, not found');
                    
                } else {
                    //

                    profile.last_modified = params.data.last_modified;

                    switch(params.type) {
                        case 'all':
                            profile.profileProperties = makeNetworkProperties(params.data.postConfig);
                            profile.profileProperties = makeNetworkProperties(params.data.profileConfig);
                            profile.avatar = params.data.avatar;
                            profile.username = params.data.username;
                            console.log('+++ full profile propeties saving...');
                            break;
                        case 'profile':
                            profile.profileProperties = makeNetworkProperties(params.data.profileConfig);
                            console.log('+++ profile  properties saved');
                            break;
                        case 'post':

                            profile.postProperties = makeNetworkProperties(params.data.postConfig);
                            console.log('+++ post  properties saved');
                            break;
                        default:
                            profile.avatar = params.data.avatar;
                            profile.username = params.data.username;
                            console.log('+++ avatar and username saved in profile properties for '+params.name);

                    }


                    profile.save(function (err) {
                        if (err) return handleError(err);
                        console.log('+++ abridged profile saved');
                        callback(profile); // return settings in JSON format
                    });
                }
            });
        //}
            
    }
};

function makeNetworkProperties(props) {
    var properties = _.pluck(_.filter(props, {content: { 'enabled':  true }}), 'content');
    var attributeGroup = _.pluck(_.filter(props, 'grouped'), 'content');
    _.filter(attributeGroup, function(attribute){
        _.forEach(attribute, function(item, key){
            if (item.enabled) properties.push(item);
        });
    });

    savedProps = {};
    _.forEach(properties, function(item, key){
        savedProps[item.label] = item;
    });

    return savedProps;

}

module.exports = Profile = mongoose.model('Profile', schema);