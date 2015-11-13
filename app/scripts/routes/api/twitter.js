// load the setting model
var defaultSettings = require('../../../../config');
var obj = require('../../../../utils/objTools');
var str = require('../../../../utils/stringTools');
var Settings = require('../../models/Settings');
var Profile = require('../../models/Profile');
var merge = require('merge'),original, cloned;
var mongoose = require('mongoose');

var namespace = 'twitter';
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// expose the routes to our app with module.exports
module.exports = function(app) {
    app.get('/api/' + namespace + '/profile', function(req, res) {

        // if (err) res.send(err)
        var params = {
            screen_name: process.env.TWITTER_USERNAME
        };
        client.get('users/show', params, function(error, docs, response) {
            if (!error) {

                Profile.update({
                    data: {
                        fetchedProfile: docs,
                        profileConfig: makeParent(docs, {})
                    },
                    function(profile) {
                        res.json(profile);
                    }
                });

            } else {
                console.log(error)
            }
        });
            
    });


    app.get('/api/' + namespace + '/posts/:count', function(req, res) { 

        
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