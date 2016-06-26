// required packages
var mongoose = require('mongoose');
var _ = require('lodash');

// models
var Config = require('../../models/configModel');
var Drop = require('../../models/dropModel');

// custom packages
var assignValues = require('../../../../app/scripts/custom-packages/prioritize').assignValues;

// route config
var namespace = 'instagram';
var client = require('instagram-node').instagram();
client.use({
    client_id: process.env.INSTAGRAM_API_KEY,
    client_secret: process.env.INSTAGRAM_API_SECRET,
    access_token: process.env.INSTAGRAM_API_ACCESS_TOKEN
});
// expose the routes to our app with module.exports

module.exports = function(app) {

    app.get('/api/' + namespace + '/fetch/:type', function(req, res) {

        if (req.params.type == 'profile') {

            client.user('self', function(err, result, remaining, limit) {
                if (err) {
                    console.log(err);
                } else {

                    resetConfig(req.params.type, result, function(boom){
                        res.json(boom);
                    });

                }
            });
        } else {

            client.user_self_media_recent({count: 5}, function(err, medias, pagination, remaining, limit) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log( assignValues(medias[4]) );
                    //res.json(config);

                    resetConfig(req.params.type, medias[3], function(boom){
                        res.json(boom);
                    });
                }
            });
        }

            
    });




    app.post('/api/' + namespace + '/fetch/posts/:count/:sample', function(req, res) {
        // //console.log(req.params);
        // //console.log(req.body);
        // //console.log(req);

        client.user_self_media_recent({count: req.params.count}, function(err, medias, pagination, remaining, limit) {
            if (err) {
                //console.log(err);
            } else {
                ////console.log('req.body > '+ req.body);
                var posts = _.filter(medias, function(media){
                    return assignValues(media);
                });

                Drop.storeRain({
                    namespace: namespace,
                    posts: posts,
                    sample: req.params.sample
                }, function(drops) {

                    res.json(drops);

                });

            }
        });

    });

    var resetConfig = function(type, update, cb) {

        var _config = new Config({name: namespace}); // instantiated Config

        _config.updateConfigModel({
            data: update,
            type: type,
            reset: true
        }, function(config) {
                cb(config);

            //});
        });
    };

};

