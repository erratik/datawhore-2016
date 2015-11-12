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
    app.post('/api/' + namespace + '/profile', function(req, res) {

        client.user('self', function(err, result, remaining, limit) {
            if (err) {
                console.log(err);
            } else {
                // console.log(result);
                Profile.updateProfile({
                    namespace: namespace,
                    avatar: result.profile_picture,
                    username: process.env.INSTAGRAM_USERNAME,
                    profile: result
                }, function(data) {
                    // console.log(data);
                    res.json(data);
                });
            }
        });
            
    });


    app.post('/api/' + namespace + '/posts/:count', function(req, res) {
        // console.log(req.params);
        // console.log(req.body);
        // console.log(req);
        client.user_self_media_recent({count: req.body.count}, function(err, medias, pagination, remaining, limit) {
            if (err) {
                console.log(err);
            } else {
                /*var mediaKeyCategories = Object.keys(medias[0]);

                var postObject = {};
                for (var i = 0; i < mediaKeyCategories.length; i++) {
                    postObject[mediaKeyCategories[i]] = {};
                    // created > postObject['+mediaKeyCategories[i]+'] = {};
                    console.log('created > postObject['+mediaKeyCategories[i]+'] = {};');
                };

                console.log(postObject);
                // console.groupEnd();

                var postData = {};*/
                // res.json(flatten(medias, {delimiter: '__'}));
                // res.json(medias)
                res.json({posts:medias, flat: flatten(medias, {delimiter: '__'})});
            }
        });

    });

};