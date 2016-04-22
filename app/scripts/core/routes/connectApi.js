var Settings = require('../models/Core');
var Config = require('../models/Config');

var mongoose = require('mongoose');
var fs = require('fs');
var md5 = require('md5');
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
var LastfmAPI = require('lastfmapi');
var lfm_credentials = {
    'api_key': '',
    'secret': ''
};
// Create a new instance

// expose the routes to our app with module.exports
module.exports = function (app) {

    var fbgraph = require('fbgraphapi');

    var connectPaths = {
        'twitter': 'https://api.twitter.com/oauth/authorize?oauth_token=' + process.env.TWITTER_OAUTH_TOKEN,
        'swarm': 'https://foursquare.com/oauth2/authenticate/?client_id=' + process.env.SWARM_API_KEY + '&redirect_uri=' + process.env.BASE_URI + '/api/connect/swarm/callback&response_type=code',
        'instagram': 'https://api.instagram.com/oauth/authorize/?client_id=' + process.env.INSTAGRAM_API_KEY + '&redirect_uri=' + process.env.BASE_URI + '/api/connect/instagram/callback&response_type=code',
        'lastfm': 'http://www.last.fm/api/auth/?api_key=',
        'tumblr': ''
    };
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://datawhore.erratik.ca:3000/");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        next();
    });

    app.get('/api/connect/twitter/middle', function (req, res) {
        res.send(req);
    });

    app.get('/api/connect/:namespace/:key/:secret', function (req, res) {


        console.log('[API CONNECT] ' + req.params.namespace);

        lfm_credentials.api_key = req.params.key;
        lfm_credentials.api_secret = req.params.secret;

        var _config = new Config({name: req.params.namespace}); // instantiated Config


        var connectUrl = connectPaths[req.params.namespace];

        switch (req.params.namespace) {
            case 'twitter':

                break;
            case 'swarm':

                break;
            case 'instagram':

                break;
            case 'facebook':
                //fbgraph.redirectLoginForm(req, res)
                break;
            case 'lastfm':


                var lfm = new LastfmAPI(lfm_credentials);
                lfm.auth.getToken(function(err, token){
                    var sig = md5("api_key"+req.params.key+"methodauth.getSession"+"token"+token+req.params.secret);
                    console.log(err, token, sig);


                    lfm.auth.getSession({token:token, sig:sig} , function (err, session) {
                        console.log(err, session);
                    });
                });
                //res.send(connectUrl + req.params.key + '&cb=http://datawhore.erratik.ca:3000/api/connect/' + req.params.namespace + '/callback');

                break;
            case 'tumblr':

                break;
            case 'moves':

                var Moves = require('moves');
                var moves = new Moves({
                    client_id: process.env.MOVES_API_KEY,
                    client_secret: process.env.MOVES_API_SECRET,
                    redirect_uri: process.env.BASE_URI + '/api/connect/moves/callback'
                });
                moves.authorize({
                    scope: ['activity', 'location'], //can contain either activity, location or both
                    state: 'moves_state' //optional state as per oauth
                }, res);
                break;
            default:

        }

        /*_config.update({
         data: req.body,
         type: req.params.type,
         reset: 'connect'
         }, function (config) {
         //console.log(config);
         res.json(config);
         });*/

        //console.log(req.body);
        //console.log('>> /@end');
    });
    app.get('/api/connect/:namespace/callback/:bounce?', function (req, res) {

        /*Settings.findOne({
         name: 'settings'
         }, function (err, settings) {
         if (err) res.send(err)
         var params = {
         screen_name: settings.configs.twitter.username
         };
         });
         */
        console.log('[API CONNECT CALLBACK] ' + req.params.namespace);

        switch (req.params.namespace) {
            case 'twitter':

                break;
            case 'swarm':

                Settings.findOne({
                    name: 'settings'
                }, function (err, settings) {
                    if (err) res.send(err);
                    var request = require('request');
                    request({
                        url: 'https://foursquare.com/oauth2/access_token',
                        method: 'POST',
                        formData: {
                            client_id: process.env.SWARM_API_KEY,
                            client_secret: process.env.SWARM_API_SECRET,
                            grant_type: 'authorization_code',
                            redirect_uri: process.env.BASE_URI + '/api/connect/swarm/callback',
                            code: req.query.code
                        }
                    }, function (error, response, body) {
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
                            }, function (err, settings) {
                                Settings.findOne({
                                    name: 'settings'
                                }, function (err, settings) {
                                    if (err) console.log(err);
                                    console.log(settings);
                                });
                            });
                        } else {
                            console.log(body);
                            console.log(response);
                        }
                        //res.redirect('/');
                    });
                });

                break;
            case 'instagram':

                Settings.findOne({
                        name: 'settings'
                    },
                    function (err, settings) {
                        if (err) res.send(err);
                        var request = require('request');
                        request({
                            url: 'https://api.instagram.com/oauth/access_token',
                            method: "POST",
                            formData: {
                                client_id: process.env.INSTAGRAM_API_KEY,
                                client_secret: process.env.INSTAGRAM_API_SECRET,
                                grant_type: 'authorization_code',
                                redirect_uri: process.env.BASE_URI + '/api/connect/instagram/callback',
                                code: req.query.code
                            }
                        }, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var result = JSON.parse(body);
                                settings.configs.instagram.access_token = result.access_token;
                                // settings.configs.instagram.profile = result.user;
                                for (var i = 0; i < settings.networks.length; i++) {
                                    // console.log(req.params.namespace);
                                    if (settings.networks[i].namespace == 'instagram') {
                                        settings.networks[i].connected = true;
                                    }
                                }
                                Settings.update({
                                    networks: settings.networks,
                                    configs: settings.configs
                                }, function (err, settings) {
                                    Settings.findOne({
                                        name: 'settings'
                                    }, function (err, settings) {
                                        if (err) console.log(err);
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
                break;
            case 'facebook':

                break;
            case 'lastfm':
                var lfm = new LastfmAPI(lfm_credentials);

                if (req.params.bounce) {
                    console.log(req.params.bounce);
                } else {
                    var params = {
                        cb: 'http://datawhore.erratik.ca:3000/api/connect/' + req.params.namespace + '/callback/true',
                        token: req.query.token
                    };
                    //console.log(lfm.getAuthenticationUrl(params));
                    //var authenticateUrl = lfm.getAuthenticationUrl(params);
                    lfm.auth.getToken(function(err, token){
                        console.log(err, token);

                    });
                    //



                    res.send(params);
                    // Create a new instance
                    //lfm.getAuthenticationUrl(params);
                }
                /*
                 var session = lastfm.session({
                 token: req.query.token,
                 handlers: {
                 success: function (session) {
                 // lastfm.update('nowplaying', session, { track: track } );
                 // lastfm.update('scrobble', session, { track: track, timestamp: 12345678 });
                 Settings.findOne({
                 name: 'settings'
                 }, function (err, settings) {
                 if (err) res.send(err)
                 settings.configs.lastfm.session_key = session.key;
                 for (var i = 0; i < settings.networks.length; i++) {
                 // console.log(req.params.namespace);
                 if (settings.networks[i].namespace == 'lastfm') {
                 settings.networks[i].connected = true;
                 }
                 }
                 Settings.update({
                 networks: settings.networks,
                 configs: settings.configs
                 }, function (err, settings) {
                 Settings.findOne({
                 name: 'settings'
                 }, function (err, settings) {
                 if (err) console.log(err)
                 console.log(settings);
                 // res.redirect('/');
                 });
                 });
                 });
                 }
                 }
                 });
                 */
                break;
            case 'tumblr':

                break;
            case 'moves':

                Settings.findOne({
                    name: 'settings'
                }, function (err, settings) {
                    if (err) res.send(err);
                    moves.token(req.query.code, function (error, response, body) {
                             body = JSON.parse(body);
                            var access_token = body.access_token,
                            refresh_token = body.refresh_token,
                            user_id = body.user_id,
                            expires_in = body.expires_in;
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
                        }, function (err, settings) {
                            Settings.findOne({
                                name: 'settings'
                            }, function (err, settings) {
                                if (err) console.log(err);
                                console.log(settings);
                            });
                        });
                        res.redirect('/');
                    });
                });
                break;
            default:

        }

        var _config = new Config({name: req.params.namespace}); // instantiated Config
        //_config.update({
        //    data: req.body,
        //    type: req.params.type,
        //    reset: false
        //}, function (config) {
        //    //console.log(config);
        //    res.json(config);
        //});

        //console.log(req.body);
        //console.log('>> /@end');
    });


    // var cookieParser = require('cookie-parser');    //
    // var session = require('express-session'); //
    // app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }))
    // app.use(fbgraph.auth( {
    //         appId : process.env.FACEBOOK_API_KEY,
    //         appSecret : process.env.FACEBOOK_API_SECRET,
    //         redirectUri : "http://datawhore.erratik.ca:3000/facebook",
    //         scope: 'public_profile, email, user_about_me, user_actions.news, user_photos, user_posts, user_status, user_tagged_places, user_likes, user_location, user_hometown, user_events, user_birthday, user_friends',
    //         apiVersion: "v2.2"
    //     }));

    app.get('/api/facebook', function (req, res) {
        if (!req.hasOwnProperty('facebook')) {
            console.log('You are not logged in');
            return res.redirect('/');
        }


        fs.appendFile('.env', 'FACEBOOK_ACCESS_TOKEN=' + req.facebook._accessToken + ' \n', encoding = 'utf8', function (err) {
            if (err) throw err;
        });


        Settings.findOne({
            name: 'settings'
        }, function (err, settings) {
            if (err) res.send(err);

            settings.networks.facebook.connected = true;
            Settings.update({
                networks: settings.networks,
                last_modified: Date.now() / 1000 | 0
            }, function (err, settings) {
                Settings.findOne({
                    name: 'settings'
                }, function (err, settings) {
                    if (err) console.log(err);
                    console.log(settings.networks.facebook);
                });
            });
            res.redirect('/#/settings');

        });

    });


};