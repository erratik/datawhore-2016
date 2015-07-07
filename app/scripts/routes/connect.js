// load the setting model
var defaultSettings = require('../../../config');
var Settings = require('../models/Settings');
var obj = require('../../../utils/objTools');
var str = require('../../../utils/stringTools');
var merge = require('merge'),original, cloned;
var mongoose = require('mongoose');

var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
// expose the routes to our app with module.exports
module.exports = function(app) {
    app.get('/connect/twitter', function(req, res) {
        res.redirect('https://api.twitter.com/oauth/authorize?oauth_token=' + process.env.TWITTER_OAUTH_TOKEN);
        /*
        
            var curl = require('curlrequest');
            curl.request({ 
                url: url + 'oauth/request_token',
                verbose: true,
                stderr: true,
                data: {
                    oauth_callback: 'http://datawhore.erratik.ca:8080/connect/twitter/callback'
                },
                headers: { 
                    Authorization: 'OAuth oauth_consumer_key="2dpM9pZiWpvo0fA1DkGHBpxzT", oauth_nonce="067f507b1124fdf0da4a79bb24707ca9", oauth_signature="DpnP2YYrYG7PY%2FkGkU4W1KPm7b0%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1435703471", oauth_token="19885665-PW2ovYAfixopfAYHWFswIOf8A0HfEVRpwNyoh9qmC", oauth_version="1.0"'
                }
            }, 
            function(err, data) {
                console.log(err);
                console.log(data);
            });
        */
    });
    app.get('/connect/twitter/middle', function(req, res) {
        res.send(req);
    });
    app.get('/connect/twitter/callback', function(req, res) {
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) res.send(err)
            var params = {
                screen_name: settings.configs.twitter.username
            };
            client.get('users/show', params, function(error, docs, response) {
                if (!error) {
                    //res.json(docs);
                    settings.configs.twitter.profile = docs;
                    for (var i = 0; i < settings.networks.length; i++) {
                        // console.log(req.params.namespace);
                        if (settings.networks[i].namespace == 'twitter') {
                            settings.networks[i].connected = true;
                        }
                    }
                    Settings.update({
                        networks: settings.networks,
                        configs: settings.configs
                    }, function(err, settings) {
                        Settings.findOne({
                            name: 'settings'
                        }, function(err, settings) {
                            if (err) console.log(err)
                                // console.log(settings);
                            res.redirect('/');
                        });
                    });
                } else {
                    console.log(error)
                }
            });
        });
    });
    //*****************************************************************/  
    //    LASTFM
    //*****************************************************************/
    app.get('/connect/lastfm', function(req, res) {
        res.redirect('http://www.last.fm/api/auth/?api_key=' + process.env.LASTFM_API_KEY);
    });
    app.get('/connect/lastfm/callback', function(req, res) {
        var LastFmNode = require('lastfm').LastFmNode;
        var lastfm = new LastFmNode({
            api_key: process.env.LASTFM_API_KEY,
            secret: process.env.LASTFM_API_SECRET
        });
        var session = lastfm.session({
            token: req.query.token,
            handlers: {
                success: function(session) {
                    // lastfm.update('nowplaying', session, { track: track } );
                    // lastfm.update('scrobble', session, { track: track, timestamp: 12345678 });
                    Settings.findOne({
                        name: 'settings'
                    }, function(err, settings) {
                        if (err) res.send(err)
                        settings.configs.lastfm.session_key = session.key;
                        for (var i = 0; i < settings.networks.length; i++) {
                            // console.log(req.params.namespace);
                            if (settings.networks[i].namespace == 'lastfm') {
                                settings.networks[i].connected = true;
                            }
                        }
                        var profile = lastfm.request("user.getInfo", {
                            handlers: {
                                success: function(data) {
                                    console.log("Success: " + data);

                                    console.log(data)
                                },
                                error: function(error) {
                                    console.log("Error: " + error.message);
                                }
                            }
                        });

                        Settings.update({
                            networks: settings.networks,
                            configs: settings.configs
                        }, function(err, settings) {
                            Settings.findOne({
                                name: 'settings'
                            }, function(err, settings) {
                                if (err) console.log(err)
                                console.log(settings);
                               // res.redirect('/');
                            });
                        });
                    });
                }
            }
        });
    });
    //*****************************************************************/  
    //    INSTAGRAM
    //*****************************************************************/
    app.get('/connect/instagram', function(req, res) {
        res.redirect('https://api.instagram.com/oauth/authorize/?client_id=' + process.env.INSTAGRAM_API_KEY + '&redirect_uri=' + process.env.BASE_URI + '/connect/instagram/callback&response_type=code');
    });
    app.get('/connect/instagram/callback', function(req, res) {
        // res.json(req.query)
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) res.send(err)
            var request = require('request');
            request({
                url: 'https://api.instagram.com/oauth/access_token',
                method: "POST",
                formData: {
                    client_id: process.env.INSTAGRAM_API_KEY,
                    client_secret: process.env.INSTAGRAM_API_SECRET,
                    grant_type: 'authorization_code',
                    redirect_uri: process.env.BASE_URI + '/connect/instagram/callback',
                    code: req.query.code
                }
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);

                    settings.configs.instagram.access_token = result.access_token;
                    settings.configs.instagram.profile = result.user;
                    for (var i = 0; i < settings.networks.length; i++) {
                        // console.log(req.params.namespace);
                        if (settings.networks[i].namespace == 'instagram') {
                            settings.networks[i].connected = true;
                        }
                    }
                    Settings.update({
                        networks: settings.networks,
                        configs: settings.configs
                    }, function(err, settings) {
                        Settings.findOne({
                            name: 'settings'
                        }, function(err, settings) {
                            if (err) console.log(err)
                            console.log(settings);
                        });
                    });
                } else {
                    // console.log(error);
                    // console.log(response.statusCode );
                }
                res.redirect('/');
            });
        });
    });

    //*****************************************************************/  
    //    SWARM
    //*****************************************************************/
    app.get('/connect/swarm', function(req, res) {
        res.redirect('https://foursquare.com/oauth2/authenticate/?client_id=' + process.env.SWARM_API_KEY + '&redirect_uri=' + process.env.BASE_URI + '/connect/swarm/callback&response_type=code');
    });
    app.get('/connect/swarm/callback', function(req, res) {
        //console.log(req);

        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) res.send(err)
            var request = require('request');
            request({
                url: 'https://foursquare.com/oauth2/access_token',
                method: 'POST',
                formData: {
                    client_id: process.env.SWARM_API_KEY,
                    client_secret: process.env.SWARM_API_SECRET,
                    grant_type: 'authorization_code',
                    redirect_uri: process.env.BASE_URI + '/connect/swarm/callback',
                    code: req.query.code
                }
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);

                    settings.configs.swarm.access_token = result.access_token;
                    
                    for (var i = 0; i < settings.networks.length; i++) {
                        // console.log(req.params.namespace);
                        if (settings.networks[i].namespace == 'swarm') {
                            settings.networks[i].connected = true;
                        }
                    }
                    Settings.update({
                        networks: settings.networks,
                        configs: settings.configs
                    }, function(err, settings) {
                        Settings.findOne({
                            name: 'settings'
                        }, function(err, settings) {
                            if (err) console.log(err)
                            console.log(settings);
                        });
                    });
                } else {
                    console.log(body);
                    console.log(response );
                }
                //res.redirect('/');
            });
        });

    });
    //*****************************************************************/  
    //    MOVES
    //*****************************************************************/

    var Moves = require('moves');
    var moves = new Moves({
      client_id: process.env.MOVES_API_KEY,
      client_secret: process.env.MOVES_API_SECRET,
      redirect_uri: process.env.BASE_URI+'/connect/moves/callback'
    });
    app.get('/connect/moves', function(req, res) {

        moves.authorize({
            scope: ['activity', 'location'],  //can contain either activity, location or both
            state: 'moves_state' //optional state as per oauth
          }, res);

    });
    app.get('/connect/moves/callback', function(req, res) {
        // res.json(req.query)

        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) res.send(err)
            moves.token(req.query.code, function(error, response, body) {
              var body = JSON.parse(body)
                , access_token = body.access_token
                , refresh_token = body.refresh_token
                , user_id = body.user_id
                , expires_in = body.expires_in;
                     
                settings.configs.moves.access_token = access_token;
                settings.configs.moves.refresh_token = refresh_token;
                settings.configs.moves.user_id = user_id;
                settings.configs.moves.expires_in = expires_in;

                for (var i = 0; i < settings.networks.length; i++) {
                    // console.log(req.params.namespace);
                    if (settings.networks[i].namespace == 'moves') {
                        settings.networks[i].connected = true;
                    }
                }

                Settings.update({
                    networks: settings.networks,
                    configs: settings.configs
                }, function(err, settings) {
                    Settings.findOne({
                        name: 'settings'
                    }, function(err, settings) {
                        if (err) console.log(err)
                        console.log(settings);
                    });
                });

                res.redirect('/');
            });
        });
    });

    app.post('/disconnect/network/:namespace', function(req, res) {
        Settings.findOne({
            name: 'settings'
        }, function(err, settings) {
            if (err) res.send(err);
            for (var i = 0; i < settings.networks.length; i++) {
                if (settings.networks[i].namespace == req.params.namespace) {
                    settings.networks[i].connected = false;
                }
            }
            Settings.update({
                networks: settings.networks
            }, function(err, settings) {
                console.log('DISCONNECTED NAMESPACE: ' + req.params.namespace);
                Settings.findOne({
                    name: 'settings'
                }, function(err, settings) {
                    if (err) res.send(err)
                    res.json(settings);
                });
            })
        });
    });


};