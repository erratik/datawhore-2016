// load the setting model
var defaultSettings = require('../../../../config');
var obj = require('../../../../utils/objTools');
var str = require('../../../../utils/stringTools');
var Settings = require('../../models/Settings');
var Profile = require('../../models/Profile');
var merge = require('merge'),
    original, cloned;
var mongoose = require('mongoose');
var namespace = 'facebook';
    
var fbgraph = require('fbgraphapi');

// expose the routes to our app with module.exports
module.exports = function(app) {
    console.log('test');

    app.post('/api/profiles/facebook', function(req, res) {
        console.log('boo');
        var fb = new fbgraph.Facebook(process.env.FACEBOOK_ACCESS_TOKEN, 'v2.4');
        fb.graph('/me?fields=id,name,location,birthday,friends,picture,cover', function(err, me) {
                if (err) console.log(err);
                console.log(me);
                console.log('test');
                Profile.updateProfile({
                    namespace: namespace,
                    avatar: me.picture.data.url,
                    username: process.env.FACEBOOK_USERNAME,
                    profile: me
                }, function(data) {
                    // console.log(data);
                    res.json(data);
                });
        });

    });
};