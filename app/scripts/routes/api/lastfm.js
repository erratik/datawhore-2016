// load the setting model
var defaultSettings = require('../../../../config');
var obj = require('../../../../utils/objTools');
var str = require('../../../../utils/stringTools');
var Settings = require('../../models/Settings');
var Profile = require('../../models/Profile');
var merge = require('merge'),
    original, cloned;
var mongoose = require('mongoose');
var namespace = 'lastfm';
var LastFmNode = require('lastfm').LastFmNode;
var client = new LastFmNode({
    api_key: process.env.LASTFM_API_KEY,
    secret: process.env.LASTFM_API_SECRET
});
// expose the routes to our app with module.exports
module.exports = function(app) {
    app.post('/api/profiles/' + namespace, function(req, res) {
        console.log(req.body);
            console.log('getInfo for ' + req.body.configs[namespace].username);
            client.request("user.getInfo", {
                user: req.body.configs[namespace].username,
                handlers: {
                    success: function(data) {
                        // console.log("Success: " + data);
                        var avatar = data.user.image;
                        for (var i = 0; i < avatar.length; i++) {
                            if (avatar[i].size == 'extralarge') data.avatar = avatar[i]['#text'];
                        }
                        Profile.updateProfile({
                            namespace: namespace,
                            avatar: data.avatar,
                            username: req.body.configs[namespace].username,
                            profile: data.user,
                            configs: req.body.configs,
                            profiles: req.body.profiles
                        }, function(data) {
                            // console.log(data);
                            res.json(data);
                        });
                    },
                    error: function(error) {
                        console.log("Error: " + error.message);
                    }
                }
            });

    });
};