// load the setting model
var defaultSettings = require('../../../../config');
var obj = require('../../../../utils/objTools');
var str = require('../../../../utils/stringTools');
var Settings = require('../../models/Settings');
var Profile = require('../../models/Profile');
var merge = require('merge'),original, cloned;
var mongoose = require('mongoose');

var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
// expose the routes to our app with module.exports
module.exports = function(app) {
    app.post('/api/profiles/twitter', function(req, res) {
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {

            if (err) res.send(err)
            var params = {
                screen_name: settings.configs.twitter.username
            };
            client.get('users/show', params, function(error, docs, response) {
                if (!error) {
                    
                    Profile.updateProfile({
                        namespace: 'twitter', 
                        avatar: docs.profile_image_url, 
                        profile: docs
                    }, function(profile){
                    console.log('API > twitter > saved profile...');
                        res.json(profile);
                    });
                } else {
                    console.log(error)
                }
            });
        });
    });
    


};