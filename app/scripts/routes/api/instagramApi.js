// load the setting model
var Config = require('../../models/Config');
var merge = require('merge'),original, cloned;
var mongoose = require('mongoose');
var merge = require('merge'),
    original, cloned;
var flatten = require('flat');

var makeParentNode = require('../../custom-packages/prioritize').makeParentNode;
var assignValues = require('../../custom-packages/prioritize').assignValues;

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

    app.get('/api/' + namespace + '/fetch/:configType', function(req, res) {

        if (req.params.configType == 'profile') {

            client.user('self', function(err, result, remaining, limit) {
                if (err) {
                    console.log(err);
                } else {
                    Config.update({
                        namespace: namespace,
                        data: {
                            fetchedProfile: result,
                            profileConfig: assignValues(result)
                        },
                        type: 'profile'

                    }, function(config) {
                        //console.log(config);
                        res.json(config);

                    });


                }
            });
        } else {

            client.user_self_media_recent({count: 5}, function(err, medias, pagination, remaining, limit) {
                if (err) {
                    console.log(err);
                } else {

                    Config.update({
                        namespace: namespace,
                        data: {
                            postConfig: assignValues(medias[4])

                        },
                        type: 'post'
                    }, function(config) {

                        res.json(config);

                    });
                }
            });
        }

            
    });




    app.post('/api/' + namespace + '/fetch/posts/:count', function(req, res) {
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

