
var Settings = require('../../models/Core');
var Profile = require('../../models/Profile');

var mongoose = require('mongoose');
var namespace = 'lastfm';
var LastFmNode = require('lastfm').LastFmNode;
var client = new LastFmNode({
    api_key: process.env.LASTFM_API_KEY,
    secret: process.env.LASTFM_API_SECRET
});
// expose the routes to our app with module.exports
module.exports = function(app) {
    app.post('/api/' + namespace + '/profile', function(req, res) {
        // //console.log(req.body);
            //console.log('getInfo for ' + process.env.LASTFM_USERNAME);
            client.request("user.getInfo", {
                user: process.env.LASTFM_USERNAME,
                handlers: {
                    success: function(data) {
                        // //console.log("Success: " + data);
                        var avatar = data.user.image;
                        for (var i = 0; i < avatar.length; i++) {
                            if (avatar[i].size == 'extralarge') data.avatar = avatar[i]['#text'];
                        }
                        Profile.updateProfile({
                            namespace: namespace,
                            avatar: data.avatar,
                            username: process.env.LASTFM_USERNAME,
                            profile: data.user
                        }, function(data) {
                            // //console.log(data);
                            res.json(data);
                        });
                    },
                    error: function(error) {
                        //console.log("Error: " + error.message);
                    }
                }
            });

    });
};