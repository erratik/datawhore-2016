var Settings = require('../models/Core');
var Config = require('../models/Config');

var mongoose = require('mongoose');
var oauthSignature = require('oauth-signature');
var fs = require('fs');


// Create a new instance

// expose the routes to our app with module.exports
module.exports = function (app) {

    var fbgraph = require('fbgraphapi');

    app.get('/api/connect/twitter/middle', function (req, res) {
        res.send(req);
    });

    app.get('/api/connect/:namespace/:key/:secret', function (req, res) {

        //if (req.params.namespace == 'callback') res.send();
        console.log('[API CONNECT] ' + req.params.namespace);

        Config.findByName(req.params.namespace, function (err, config) {

            var oauth = config[0].settings.oauth;

            switch (req.params.namespace) {
                case 'twitter':

                    res.redirect('/api/callback/'+req.params.namespace);

                    break;
                case 'swarm':

                    var credentials = {
                        secrets : {
                            redirectUrl: oauth.redirect_uri.value,
                            clientId: oauth.api_key.value,
                            clientSecret: oauth.api_secret.value
                        }
                    };
                    var foursquare = require('node-foursquare')(credentials);
                    res.redirect( foursquare.getAuthClientRedirectUrl() );

                    break;
                case 'instagram':

                    var api = require('instagram-node').instagram();

                    api.use({
                        client_id: oauth.api_key.value,
                        client_secret: oauth.api_secret.value
                    });


                    var redirect_uri = oauth.redirect_uri.value;

                    //exports.authorize_user = function(req, res) {
                    res.send(api.get_authorization_url(redirect_uri, { scope: ['basic'], state: 'authed-basic' }));
                    //};
                    break;
                case 'facebook':
                    //fbgraph.redirectLoginForm(req, res)
                    break;
                case 'spotify':
                    var SpotifyWebApi = require('spotify-web-api-node');

                    var scopes = ['user-read-private', 'user-read-email'],
                        redirectUri = config[0].settings.oauth.redirect_uri.value + '/middle',
                        clientId = config[0].settings.oauth.api_key.value,
                        state = 'authed';

                    // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
                    var spotifyApi = new SpotifyWebApi({
                        redirectUri: redirectUri,
                        clientId: clientId
                    });

                    // Create the authorization URL
                    var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

                    res.send(authorizeURL);

                    break;
                case 'tumblr':
                    /*
                    var passport = require('passport-tumblr');
                    passport.use(new TumblrStrategy({
                            consumerKey: oauth.api_key.value,
                            consumerSecret: oauth.api_secret.value,
                            callbackURL: oauth.redirect_uri.value
                        },
                        function(token, tokenSecret, profile, done) {
                            User.findOrCreate({ tumblrId: profile.id }, function (err, user) {
                                return done(err, user);
                            });
                        }
                    ));*/
                    //passport.authenticate('tumblr');
                    res.redirect('/api/callback/'+req.params.namespace);
                    break;
                case 'moves':

                    var Moves = require('moves');
                    var moves = new Moves({
                        client_id: oauth.api_key.value,
                        client_secret: oauth.api_secret.value,
                        redirect_uri: oauth.redirect_uri.value
                    });

                    var authorizeURL = moves.authorize({
                        scope: ['activity', 'location'] //can contain either activity, location or both
                        , state: 'authed' //optional state as per oauth
                    });

                    res.send(authorizeURL);
                    break;
                default:

            }
        });


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
    app.get('/api/callback/:namespace/:bounce?', function (req, res) {

        console.log('[API CONNECT CALLBACK] ' + req.params.namespace);


        Config.findByName(req.params.namespace, function (err, config) {

            //console.log(config);
            var oauth = config[0].settings.oauth;
            var _config = new Config({name: req.params.namespace}); // instantiated Config

            _config.connect(function () {

                switch (req.params.namespace) {
                    case 'twitter':
                        res.redirect('/#/');
                        break;
                    case 'tumblr':

                        var passport = require('passport-tumblr');
                        passport.use(new TumblrStrategy({
                                consumerKey: oauth.api_key.value,
                                consumerSecret: oauth.api_secret.value,
                                callbackURL: oauth.redirect_uri.value
                            },
                            function(token, tokenSecret, profile, done) {
                                User.findOrCreate({ tumblrId: profile.id }, function (err, user) {
                                    return done(err, user);
                                });
                            }
                        ));

                        passport.authenticate('tumblr', { failureRedirect: '/login' },
                            function(req, res) {
                                // Successful authentication, redirect home.
                                res.redirect('/');
                            });
                        //res.redirect('/#/');
                        break;
                    case 'swarm':

                        var credentials = {
                            secrets : {
                                redirectUrl: oauth.redirect_uri.value,
                                clientId: oauth.api_key.value,
                                clientSecret: oauth.api_secret.value
                            }
                        };

                        var foursquare = require('node-foursquare')(credentials);

                        foursquare.getAccessToken({
                            code: req.query.code
                        }, function (error, access_token) {
                            if(error) {
                                res.send('An error was thrown: ' + error.message);
                            }
                            else {
                                // Save the accessToken and redirect.
                                console.log('Yay! Access token is ' + access_token);
                                oauth.access_token = {
                                    value: access_token,
                                    label: 'Access Token'
                                };

                                _config.update({
                                    data: oauth,
                                    type: 'settings.oauth'
                                }, function() {
                                    res.redirect('/#/');
                                });
                            }
                        });

                        break;

                    case 'instagram':

                        var api = require('instagram-node').instagram();
                        api.use({
                            client_id: oauth.api_key.value,
                            client_secret: oauth.api_secret.value
                        });

                        //api.handleauth = function(req, res) {
                        api.authorize_user(req.query.code, oauth.redirect_uri.value, function(err, result) {
                            if (err) {
                                console.log(err.body);
                                res.send("Didn't work");
                            } else {
                                console.log('Yay! Access token is ' + result.access_token);
                                oauth.access_token = {
                                    value: result.access_token,
                                    label: 'Access Token'
                                };

                                _config.update({
                                    data: oauth,
                                    type: 'settings.oauth'
                                }, function() {
                                    res.redirect('/#/');
                                });
                            }
                        });
                    break;
                    case 'facebook':

                    break;
                    case 'spotify':
                        if (req.params.bounce == 'middle') {

                            //console.log(config);
                            //res.json(config);
                            res.redirect('/#/');
                            /*
                             //var SpotifyWebApi = require('spotify-web-api-node');
                             //// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
                             //var spotifyApi = new SpotifyWebApi({
                             //    redirectUri: oauth.redirect_uri.value,
                             //    clientId: oauth.api_key.value,
                             //    clientSecret: oauth.api_secret.value
                             //});
                             //// Get Elvis' albums
                             //spotifyApi.getMe()
                             //    .then(function(data) {
                             //        console.log('Some information about the authenticated user', data.body);
                             //    }, function(err) {
                             //        console.log('Something went wrong!', err);
                             //    });

                             // The code that's returned as a query parameter to the redirect URI
                             var code = req.query.code;
                             //console.log(oauth.redirect_uri);
                             spotifyApi.authorizationCodeGrant(code)
                             .then(function(data) {
                             console.log('The token expires in ' + data['expires_in']);
                             console.log('The access token is ' + data['access_token']);
                             console.log('The refresh token is ' + data['refresh_token']);

                             /!* Ok. We've got the access token!
                             Save the access token for this user somewhere so that you can use it again.
                             Cookie? Local storage?
                             *!/

                             console.log(data);
                             /!* Redirecting back to the main page! :-) *!/
                             res.redirect('/#');

                             }, function(err) {
                             //res.status(err.code);
                             res.send(err);
                             });*/
                        }
                        /*
                         var session = spotify.session({
                         token: req.query.token,
                         handlers: {
                         success: function (session) {
                         // spotify.update('nowplaying', session, { track: track } );
                         // spotify.update('scrobble', session, { track: track, timestamp: 12345678 });
                         Settings.findOne({
                         name: 'settings'
                         }, function (err, settings) {
                         if (err) res.send(err)
                         settings.configs.spotify.session_key = session.key;
                         for (var i = 0; i < settings.networks.length; i++) {
                         // console.log(req.params.namespace);
                         if (settings.networks[i].namespace == 'spotify') {
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
                    case 'moves':

                        var Moves = require('moves');
                        var moves = new Moves({
                            client_id: oauth.api_key.value,
                            client_secret: oauth.api_secret.value,
                            redirect_uri: oauth.redirect_uri.value
                        });

                        moves.token(req.query.code, function(error, response, body) {
                            //console.log(response);
                            console.log(JSON.parse(body));
                            var data = JSON.parse(body);

                            oauth.access_token = {
                                value: data.access_token,
                                label: 'Access Token'
                            };
                            oauth.expires_in = {
                                value: data.expires_in,
                                label: 'Expires in'
                            };
                            oauth.refresh_token = {
                                value: data.refresh_token,
                                label: 'Refresh Token'
                            };

                            _config.update({
                                data: oauth,
                                type: 'settings.oauth'
                            }, function() {
                                res.redirect('/#/');
                            });
                        });


                    break;

                    default:

                }
            });
        });

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