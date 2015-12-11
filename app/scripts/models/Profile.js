var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
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
}, {strict: false});
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
            name: options.data.name || options.name, // if not saving all, use the name set in updateConfig(),
            updating: options.updating
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
                            profile.profileProperties = writeProperties(params.data.postConfig, profile.profileProperties);
                            profile.profileProperties = writeProperties(params.data.profileConfig, profile.postProperties);
                            profile.avatar = params.data.avatar;
                            profile.username = params.data.username;
                            console.log('+++ full profile propeties saving...');
                            break;
                        case 'profile':
                            profile.profileProperties = params.updating ? params.data : writeProperties(params.data.profileConfig, profile.profileProperties);
                            console.log('+++ profile  properties saved');
                            break;
                        case 'post':
                            //console.log(params.updating);
                            //console.log(params.data);
                            profile.postProperties = params.updating ? params.data : writeProperties(params.data.postConfig, profile.postProperties);
                            profile.post = profile.postProperties;
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
                        if (params.updating) {
                            callback(profile[params.type+'Properties'])
                        } else {
                            callback(profile); // return settings in JSON format
                        }
                    });
                }
            });
        //}
            
    }
};

function mapAttributeKeys(item, prefix) {
    var keys = {};
    var attributeName = prefix+"__"+item.label;
    keys[attributeName] = {
        friendlyName: item.label
    };
    keys[attributeName].path = prefix+"__"+item.label;
    return keys;
}

function writeProperties(props, current) {
    var deleting = {};
    var savedProps = {};
    var properties = _.pluck(_.filter(props, {content: { 'enabled':  true }}), 'content');

    var attributeGroup = _.pluck(_.filter(props, 'grouped'), 'content');
    _.forEach(attributeGroup, function(attribute, cle){
        _.forEach(attribute, function(item, key){
            // second level
            if (item.enabled) {
                properties.push(mapAttributeKeys(item, _.findKey(props, {content: attribute}),  {content: attribute}));
            } else if (!item.grouped && !item.enabled){
                //console.log(item.label+' is disabled');
                delete current[item.label];
            }

            //third level
            if (item.grouped) {
                var innerGroup = _.filter(item.content, 'enabled');
                _.forEach(innerGroup, function(group){
                    console.log(group);
                    var groupKey = _.findKey(item.content, group);
                    var query = {};
                    query[key] = {content: {}};
                    query[key].content[groupKey] = group;

                    if (group !== undefined) {

                        console.log(query);
                        //console.log(findKey(props, {content: query})+'__'+key);
                        //console.log(mapAttributeKeys(_.first(innerGroup), _.findKey(props, {content: query})+'__'+key));

                        properties.push(mapAttributeKeys(group, _.findKey(props, {content: query})+'__'+key,  {content: query}));
                    }

                });

                var disabledGroups = _.filter(item.content, 'enabled', false);
                var disabledGroupKey = _.findKey(item.content, _.first(innerGroup));
                var disabledQuery = {};
                disabledQuery[key] = {content: {}};
                disabledQuery[key].content[disabledGroupKey] = _.first(disabledGroups);

                deleting[_.findKey(props, {content: disabledQuery})+'__'+key+'__'+disabledGroupKey] = true;
                //console.log(_.findKey(props, {content: disabledQuery})+'__'+key+'__'+disabledGroupKey);
                //console.log(disabledGroups);



            }

        });
    });

    _.forEach(properties, function(item, key){

        if (item.label !== undefined) {
            //first & second level
            if (current[item.label] !== undefined) {
                //console.log(current);
                savedProps[item.label] = current[item.label];
            } else {

                savedProps[item.label] = {
                    friendlyName: item.label,
                    path: item.label
                };
            }
        } else {
            // third level
            _.merge(savedProps, item);
            if (_.filter(current, item)) _.merge(savedProps, current);
            if (_.filter(deleting, item)) _.reject(savedProps, item);
        }
    });

    return savedProps;

}

module.exports = Profile = mongoose.model('Profile', schema);