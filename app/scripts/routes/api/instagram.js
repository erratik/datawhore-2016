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
// expose the routes to our app with module.exports
module.exports = function(app) {
    app.post('/api/profiles/' + namespace, function(req, res) {

            client.user_self_media_recent({
                count: 1
            }, function(err, medias, pagination, remaining, limit) {
                if (err) {
                    console.log(err);
                } else {
                    Profile.updateProfile({
                        namespace: namespace,
                        avatar: medias[0].user.profile_picture,
                        username: req.body.configs[namespace].username,
                        profile: medias[0].user,
                        configs: req.body.configs,
                        profiles: req.body.profiles
                    }, function(data) {
                        // console.log(data);
                        res.json(data);
                    });
                }
            });
            
    });
};