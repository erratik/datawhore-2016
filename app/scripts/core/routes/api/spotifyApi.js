
var Config = require('../../models/Config');
var Drop = require('../../models/Drop');

var mongoose = require('mongoose');
var _ = require('lodash');

var namespace = 'swarm';

var assignValues = require('../../../custom-packages/prioritize').assignValues;

var swarmConfig = {
    'secrets' : {
        'clientId' : process.env.SWARM_API_KEY,
        'clientSecret' : process.env.SWARM_API_SECRET,
        'redirectUrl' : 'http://datawhore.erratik.ca:3000/connect/swarm/callback',
        'accessToken' : process.env.SWARM_ACCESS_TOKEN
    }
};

var client = require('node-foursquare')(swarmConfig);

// expose the routes to our app with module.exports
module.exports = function(app) {

    app.get('/api/' + namespace + '/fetch/:type', function(req, res) {

        Config.findByName(req.params.namespace, function (err, config) {

            //console.log(config);
            var oauth = config[0].settings.oauth;

            if (req.params.type == 'profile') {

                client.Users.getUser('self', process.env.SWARM_ACCESS_TOKEN,
                    function (error, data) {
                        if(error) {
                            //console.log(error);
                        } else {
                            //console.log(data.user);
                            resetConfig(req.params.type, data.user, function(boom){
                                res.json(boom);
                            });

                        }
                    });
            } else {

                client.Users.getCheckins('self', {limit: 1}, process.env.SWARM_ACCESS_TOKEN, function (error, data) {
                    //console.log(data.checkins.items[0]);
                    resetConfig(req.params.type, data.checkins.items[0], function(boom){
                        res.json(boom);
                    });

                });

            }
        });
    });


    app.post('/api/' + namespace + '/fetch/posts/:count/:sample', function(req, res) {

        client.Users.getCheckins('self', {limit: req.params.count}, process.env.SWARM_ACCESS_TOKEN, function (error, data) {

            if (error) {
                //console.log(err);
            } else {
                ////console.log('req.body > '+ req.body);
                var posts = _.filter(data.checkins.items, function(media){
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

        _config.update({
            data: update,
            type: type,
            reset: true
        }, function(config) {
            cb(config);
        });
    };
};