var Settings = require('../../models/Core');
var Profile = require('../../models/Profile');

var mongoose = require('mongoose');
var namespace = 'facebook';
    
var fbgraph = require('fbgraphapi');

// expose the routes to our app with module.exports
module.exports = function(app) {

    // UPDATE FACEBOOK PROFILE
    app.get('/api/' + namespace + '/profile', function(req, res) {
        // //console.log('boo');
        var fb = new fbgraph.Facebook(process.env.FACEBOOK_ACCESS_TOKEN, 'v2.4');
        fb.graph('/me?fields=id,name,location,birthday,friends,picture,cover', function(err, me) {
                if (err) console.log(err);
                
                Profile.updateProfile({
                    namespace: namespace,
                    avatar: me.picture.data.url,
                    username: process.env.FACEBOOK_USERNAME,
                    profile: me
                }, function(data) {
                    // //console.log(data);
                    res.json(data);
                });
        });

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

};