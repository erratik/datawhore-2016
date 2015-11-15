// load the setting model
var Config = require('../../models/Config');
var merge = require('merge'),original, cloned;
var mongoose = require('mongoose');
var merge = require('merge'),
    original, cloned;
var flatten = require('flat');
var mongoose = require('mongoose');
var namespace = 'instagram';
var client = require('instagram-node').instagram();
client.use({
    client_id: process.env.INSTAGRAM_API_KEY,
    client_secret: process.env.INSTAGRAM_API_SECRET,
    access_token: process.env.INSTAGRAM_API_ACCESS_TOKEN
});
// expose the routes to our app with module.exports
module.exports = function(app) {
    app.get('/api/' + namespace + '/config', function(req, res) {

                console.log('result');
        client.user('self', function(err, result, remaining, limit) {
            if (err) {
                console.log(err);
            } else {

                Config.update({
                    namespace: namespace,
                    data: {
                        fetchedProfile: result,
                        profileConfig: makeParent(result, {})
                    }
                }, function(config) {
                    
                    client.user_self_media_recent({count: 1}, function(err, medias, pagination, remaining, limit) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(medias);
                            Config.update({
                                namespace: namespace,
                                data: {
                                    postConfig: makeParent(medias[0], {})
                                }
                            }, function(config) {
                            // console.log(config);
                                res.json(config);
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