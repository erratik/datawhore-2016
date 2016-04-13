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

    // static content routes
    app.use(express.static(__dirname + '/../app'));  // set the static files location /app/img will be /img for users
    //app.use('/core',express.static(__dirname + '/../app/modules/core')); // static path for core scripts
    app.use('/bower_components', express.static(__dirname + '/../bower_components'));
    //app.use(express.static(__dirname + '/../bower_components'));

    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    // // app.use(express.bodyParser());

    app.use(methodOverride());


    // routes ======================================================================


    require('../app/scripts/core/routes/configApi')(app);
    require('../app/scripts/core/routes/profileApi')(app);
    require('../app/scripts/core/routes/coreApi')(app);
    //require('../app/scripts/core/routes/app/scripts/routes/connectApi')(app);

    // TODO: Tay - require-directory?
    require('../app/scripts/core/routes/api/facebookApi')(app);
    require('../app/scripts/core/routes/api/twitterApi')(app);
    require('../app/scripts/core/routes/api/lastfmApi')(app);
    require('../app/scripts/core/routes/api/instagramApi')(app);
    require('../app/scripts/core/routes/api/swarmApi')(app);

    // listen (start app with node server.js) ======================================
    app.listen(port);