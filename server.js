// server.js
    require('dotenv').load();

    // set up ======================================================================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');  // mongoose for mongodb
    var port     = process.env.PORT;                // set the port
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var moment = require('moment');
    //*****************************************************************/  
    //    Configuration
    //*****************************************************************/

    // Connect to our mongo database
    mongoose.connect(process.env.MONGO_DB);  

    mongoose.connection.on('error', function(err){
        console.log(process.env.MONGO_DB);
        console.log(err);
    });

    app.use(express.static(__dirname + '/app'));  // set the static files location /app/img will be /img for users
    app.use('/bower_components', express.static(__dirname + '/bower_components'));
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    // // app.use(express.bodyParser());

    app.use(methodOverride());

    ///** Angoose bootstraping */
    //require("angoose").init(app, {
    //    'module-dirs':'./app/scripts/models',
    //    'mongo-opts': 'localhost:27017/data/datawhore'
    //});


    // routes ======================================================================


    require('./app/scripts/routes/configApi')(app);
    require('./app/scripts/routes/profileApi')(app);
    require('./app/scripts/routes/coreApi')(app);
    //require('./app/scripts/routes/connectApi')(app);

    // TODO: Tay - require-directory?
    require('./app/scripts/routes/api/facebookApi')(app);
    require('./app/scripts/routes/api/twitterApi')(app);
    require('./app/scripts/routes/api/lastfmApi')(app);
    require('./app/scripts/routes/api/instagramApi')(app);
    require('./app/scripts/routes/api/swarmApi')(app);

    // listen (start app with node server.js) ======================================
    app.listen(port);