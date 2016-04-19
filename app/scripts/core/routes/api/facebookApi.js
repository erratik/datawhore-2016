// required packages
var Config = require('../../models/Config');
var Drop = require('../../models/Drop');

var mongoose = require('mongoose');
var _ = require('lodash');

var assignValues = require('../../../custom-packages/prioritize').assignValues;

var namespace = 'facebook';
    
var fbgraph = require('fbgraphapi');

// expose the routes to our app with module.exports
module.exports = function(app) {
    app.get('/api/' + namespace + '/fetch/:type', function(req, res) {

        if (req.params.type == 'profile') {
            // //console.log('boo');
            var fb = new fbgraph.Facebook(process.env.FACEBOOK_ACCESS_TOKEN, 'v2.4');
            fb.graph('/me?fields=id,name,location,birthday,friends,picture,cover', function (err, me) {
                if (err) console.log(err);

                resetConfig(req.params.type, docs, function(boom){
                    res.json(boom);
                });

            });
        } else {

        }

    });

    //GET POSTS
    app.get('/api/' + namespace + '/posts', function(req, res) {
        //console.log(req.body);
        var fb = new fbgraph.Facebook(process.env.FACEBOOK_ACCESS_TOKEN, 'v2.4');
        fb.graph('/me/feed', function(err, result) {
            if (err) console.log(err);
                
            //console.log(result);
               
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

            //});
        });
    };

};