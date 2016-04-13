// required packages
var mongoose = require('mongoose');
var _ = require('lodash');

// models
var Config = require('../../models/Config');
var Drop = require('../../models/Drop');

// custom packages
var assignValues = require('../../../custom-packages/prioritize').assignValues;

// network config
var namespace = 'twitter';
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var params = {
    // screen_name: 'wptweeto'
    screen_name: process.env.TWITTER_USERNAME
};
// expose the routes to our app with module.exports
module.exports = function(app) {
    app.get('/api/' + namespace + '/fetch/:configType', function(req, res) {
        //console.log('••• '+ req.params.configType);
        // if (err) res.send(err)
        if (req.params.configType == 'profile') {


            client.get('users/show', params, function (error, docs, response) {
                if (!error) {


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
                    //console.log(error)
                }
            });
        } else {
            client.get('statuses/user_timeline', params, function (error, posts, response) {
                if (!error) {

                    delete posts[0].user;

                    ////console.log(assignValues(posts[0]));

                    Config.update({
                        namespace: namespace,
                        data: {
                            postConfig: assignValues(posts[0])
                        },
                        type: 'post'
                    },
                    function (config) {

                        res.json(config);
                    });
                } else {
                    //console.log(error)
                }
            });

        }
            
    });

    app.post('/api/' + namespace + '/fetch/posts/:count/:sample', function(req, res) {
        // //console.log(req.params);
        // //console.log(req.body);
        // //console.log(req);

        client.get('statuses/user_timeline', params, function(error, posts, response) {
            if (error) {
                //console.log(err);
            } else {
                ////console.log('req.body > '+ req.body);
                var posts = _.filter(posts, function(post){
                    return assignValues(post);
                });

                Drop.storeRain({
                    namespace: namespace,
                    posts: posts,
                    sample: req.params.sample
                },
                function(drops) {

                    res.json(drops);

                });
                //res.json({posts:medias, flat: flatten(medias, {delimiter: '__'})});
            }
        });

    });



};
