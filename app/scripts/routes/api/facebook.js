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

    // // app.use(cookieParser());


    app.post('/api/profiles/' + namespace, function(req, res) {

        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {

            var fb = new fbgraph.Facebook(process.env.FACEBOOK_ACCESS_TOKEN, 'v2.4');
            fb.graph('/me?fields=id,name,location,birthday,friends,picture,cover', function(err, me) {
                
                    Profile.updateProfile({
                        namespace: namespace,
                        avatar: me.picture.data.url,
                        username: settings.configs[namespace].username,
                        profile: me,
                        configs: settings.configs,
                        profiles: req.body.profiles
                    }, function(data) {
                        // console.log(data);
                        res.json(data);
                    });
            });


        });
    });
};