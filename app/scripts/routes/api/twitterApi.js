// load the setting model
var Config = require('../../models/Config');
var merge = require('merge'),original, cloned;
var mongoose = require('mongoose');
var makeParent = require('../../custom-packages/prioritize');
var assignValues = require('../../custom-packages/prioritize').assignValues;

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
    app.get('/api/' + namespace + '/fetch/:configType', function(req, res) {
        console.log('••• '+ req.params.configType);
        // if (err) res.send(err)
        var params = {
            screen_name: process.env.TWITTER_USERNAME
        };
        if (req.params.configType == 'profile') {


            client.get('users/show', params, function (error, docs, response) {
                if (!error) {
                    //
                    //delete docs.entities;
                    //delete docs.urls;
                    //delete docs.status;
                    //delete docs.retweeted_status;

                    Config.update({
                        namespace: namespace,
                        data: {
                            profileConfig: assignValues(docs)
                        },
                            type: 'profile'
                    },
                    function (config) {

                        res.json(config);
                    });
                } else {
                    console.log(error)
                }
            });
        } else {
            client.get('statuses/user_timeline', params, function (error, posts, response) {
                if (!error) {

                    delete posts[0].user;

                    //console.log(assignValues(posts[0]));

                    Config.update({
                        namespace: namespace,
                        data: {
                            postConfig: assignValues(posts[1])
                        },
                            type: 'post'
                    },
                    function (config) {

                        res.json(config);
                    });
                } else {
                    console.log(error)
                }
            });

        }
            
    });
    app.get('/api/' + namespace + '/config/post', function(req, res) {

        // if (err) res.send(err)
        var params = {
            screen_name: process.env.TWITTER_USERNAME
        };

            client.get('statuses/user_timeline', params, function(error, posts, response) {
                if (!error) {

                    delete posts[0].user;

                    Config.update({
                        namespace: namespace,
                        data: {
                            postConfig: assignValues(posts[0], {})
                        }
                    },
                        function(config) {

                            res.json(config);
                        });
                } else {
                    console.log(error)
                }
            });

            
    });


    app.get('/api/' + namespace + '/posts/:count', function(req, res) { 

        
    });


};
