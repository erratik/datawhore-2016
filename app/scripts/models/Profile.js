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
                            profile.profileProperties = makeNetworkProperties(params.data.postConfig);
                            profile.profileProperties = makeNetworkProperties(params.data.profileConfig);
                            profile.avatar = params.data.avatar;
                            profile.username = params.data.username;
                            console.log('+++ full profile propeties saving...');
                            break;
                        case 'profile':
                            profile.profileProperties = params.updating ? params.data : makeNetworkProperties(params.data.profileConfig);
                            //console.log(params.updating);
                            //console.log(params.data);
                            console.log('+++ profile  properties saved');
                            break;
                        case 'post':

                            profile.postProperties = makeNetworkProperties(params.data.postConfig);
                            profile.post = profile.postProperties;
                            console.log('test')
                            console.log(profile.post)
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
function mapAttributeKeys(item, props) {
    var keys = {};
    var query = {};
    query.content = {};
    query.content[item.label] = {'value' : item.value };
    console.log('label: '+item.label);
    console.log('value: '+item.value);
    console.log('query is:');
    console.log(query);

    var groupKey = _.findKey(props, query);
    keys[groupKey] = {};
    return keys;
}
function makeNetworkProperties(props) {

    var savedProps = {};
    var properties = _.pluck(_.filter(props, {content: { 'enabled':  true }}), 'content');

    var attributeGroup = _.pluck(_.filter(props, 'grouped'), 'content');
    _.filter(attributeGroup, function(attribute){
        //console.log(attribute);
        _.forEach(attribute, function(item, key){
            if (item.grouped) {
                console.log( _.pluck(_.filter(item, 'grouped'), 'content'));

            }
            if (item.enabled) {
                properties.push(item);
                console.log(mapAttributeKeys(item, props));
            }

            //var childNodes = _.pluck(_.filter(item, 'grouped'), 'content');
            //_.filter(childNodes, function(attr){
            //    _.forEach(attr, function(n, k) {
            //        if (n.enabled) {
            //            console.log( key);
            //            properties.push(n);
            //
            //            _.forEach(props, function (thang, label){
            //                //console.log(thang);
            //                if (_.has(thang, 'content.'+key+'.value.content.'+ n.label)) {
            //                    console.log(_.has(thang, 'content.'+key+'.value.content.'+ n.label) + ' -> '+label);
            //                    savedProps[label+'__'+key+'__'+ n.label] = n;
            //
            //                }
            //            });
            //        }
            //    });
            //
            //});
        });
    });
    //console.log(_.findKey(props, {content: { 'label':  'caption' }}));
    //console.log('props!');
    //console.log(props);
    _.forEach(properties, function(item, key){
        var query = {};
            query.content = {};
            query.content[item.label] = {'value' : item.value };
        //console.log('label: '+item.label);
        //console.log('value: '+item.value);
        //console.log('query is:');
        //console.log(query);

        var groupKey = _.findKey(props, query);
        //console.log('key: '+groupKey);
        var prefix = groupKey+"__"+item.label;
        var label = !groupKey ? item.label : prefix;
        savedProps[label] = item;

    });
    console.log(savedProps);
    return properties;

}

module.exports = Profile = mongoose.model('Profile', schema);