// load the setting model
var defaultSettings = require('../../../../config');
var obj = require('../../../../utils/objTools');
var str = require('../../../../utils/stringTools');
var Settings = require('../../models/Settings');
var Profile = require('../../models/Profile');
var merge = require('merge'),
    original, cloned;
var mongoose = require('mongoose');
var namespace = 'swarm';

var swarmConfig = {
    'secrets' : {
        'clientId' : process.env.SWARM_API_KEY,
        'clientSecret' : process.env.SWARM_API_SECRET,
        'redirectUrl' : 'http://datawhore.erratik.ca:3000/connect/swarm/callback',
        'accessToken' : process.env.SWARM_ACCESS_TOKEN
    }
}

var client = require('node-foursquare')(swarmConfig);

// expose the routes to our app with module.exports
module.exports = function(app) {
    app.post('/api/profiles/' + namespace, function(req, res) {
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {

          client.Users.getUser('self', process.env.SWARM_ACCESS_TOKEN, 
            function (error, data) {
              if(error) {
                console.log(error);
              } else {
                  console.log(data.user);

                    Profile.updateProfile({
                        namespace: namespace,
                        avatar: data.user.photo.prefix+'400x400'+data.user.photo.suffix,
                        username: settings.configs[namespace].username,
                        profile: data.user,
                        configs: settings.configs,
                        profiles: req.body.profiles
                    }, function(data) {
                        // console.log(data);
                        res.json(data);
                    });

              }
          });

        });
    });
};