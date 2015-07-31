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
    app.post('/api/profiles/'+namespace, function(req, res) {

            // if (err) res.send(err)
            var params = {
                screen_name: process.env.TWITTER_USERNAME
            };
            client.get('users/show', params, function(error, docs, response) {
                if (!error) {
                    
                    Profile.updateProfile({
                        namespace: namespace, 
                        avatar: docs.profile_image_url, 
                        username: params.screen_name,
                        profile: docs
                    }, function(data){
                        // console.log(data);
                        res.json(data);
                    });
                } else {
                    console.log(error)
                }
            });
            
    });


};