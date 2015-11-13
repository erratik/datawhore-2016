// load the setting model
var defaultSettings = require('../../../../config');
var obj = require('../../../../utils/objTools');
var str = require('../../../../utils/stringTools');
var Settings = require('../../models/Settings');
var Profile = require('../../models/Profile');
var merge = require('merge'),
    original, cloned;
var mongoose = require('mongoose');
var namespace = 'instagram';
var client = require('instagram-node').instagram();
client.use({
    client_id: process.env.INSTAGRAM_API_KEY,
    client_secret: process.env.INSTAGRAM_API_SECRET,
    access_token: process.env.INSTAGRAM_API_ACCESS_TOKEN
});
var flatten = require('flat');
// expose the routes to our app with module.exports
module.exports = function(app) {
    app.get('/api/' + namespace + '/profile', function(req, res) {

        client.user('self', function(err, result, remaining, limit) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                Profile.update({
                    namespace: namespace,
                    data: {
                        fetchedProfile: result,
                        profileConfig: makeParent(result, {})
                    }
                }, function(profile) {
                    
                    client.user_self_media_recent({count: 1}, function(err, medias, pagination, remaining, limit) {
                        if (err) {
                            console.log(err);
                        } else {
                            // console.log(result);
                            Profile.update({
                                data: {
                                    postConfig: makeParent(medias[0], {})
                                }
                            }, function(profile) {
                                res.json(profile);
                            });
                        }
                    });

                });
            }
        })

        // console.log(post);
            
    });


    app.post('/api/' + namespace + '/posts/:count', function(req, res) {
        // console.log(req.params);
        // console.log(req.body);
        // console.log(req);
        client.user_self_media_recent({count: req.body.count}, function(err, medias, pagination, remaining, limit) {
            if (err) {
                console.log(err);
            } else {
                res.json({posts:medias, flat: flatten(medias, {delimiter: '__'})});
            }
        });

    });

};

var makeParent = function(nodeParent, objParent) {
    // var obj;
    var _nodeKeys = Object.keys(nodeParent);
    for (var i = 0; i < _nodeKeys.length; i++) {

        var content = nodeParent[_nodeKeys[i]];
        if (content !== null ) {
            var that = nodeParent[_nodeKeys[i]];

            objParent[_nodeKeys[i]] = makeData(that, _nodeKeys[i]);
            var injected = objParent[_nodeKeys[i]];

            if (injected.grouped 
                && typeof injected.content.value == 'object' 
                || typeof injected.content.value == 'array') {
                objParent[_nodeKeys[i]].content = makeParent(injected.content.value, {});
            }

        }
    };
    return objParent;
};


var makeData = function(val, label){
    var obj = {
            content: {
                enabled: false,
                label: label,
                value: val
            }
        
    };  
    var thisVal = obj.content.value;
    obj.grouped = (typeof thisVal == 'array' || typeof thisVal == 'object') ? true : false;

    return obj;
};