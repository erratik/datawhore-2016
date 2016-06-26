var mongoose = require('mongoose');
var moment = require('moment');

var Settings = require('../models/Core');
var Config = require('../models/Config');
var Profile = require('../models/Profile');

// expose the routes to our app with module.exports

module.exports = function(app) {

    //*****************************************************************/  
    //    Configs
    //*****************************************************************/

    // todo: deprecate this route
    // retrieve network config -------------------------------------------------------*/
    app.get('/api/config/network/:namespace', function(req, res) {
        Config.findByName({namespace: req.params.namespace}, function(config){

            //console.log('>> @start Config.get({namespace: '+req.params.namespace+'})');
            //console.log(config);
            //console.log('>> /@end /api/config/network/:'+req.params.namespace);

            res.json(config);

        });

    });

    // add/updateConfigModel network config -------------------------------------------------------*/
    app.post('/api/config/update/:namespace/:type', function(req, res) {

        //console.log('>> @start Config.updateConfigModel({namespace: '+req.params.namespace+'})');
        var _config = new Config({name: req.params.namespace}); // instantiated Config

        _config.updateConfigModel({
            data: req.body,
            type: req.params.type,
            reset: false
        }, function(config) {
            console.log('hkhkjk',config);
            res.json(config);
        });

        //console.log(req.body);
        //console.log('>> /@end');
    });

    //*****************************************************************/
    //    Profiles
    //*****************************************************************/

    // retrieve network configs (post & profile) -------------------------*/
    app.get('/api/profile/config/:namespace', function(req, res) {

        Config.findByName(req.params.namespace, function(err, config) {
            //console.log('>> @start Profile.get({namespace: '+req.params.namespace+'})');
            //console.log('static: '+config[0]); // ruff
            //console.log('>> /@end /api/config/profile/:'+req.params.namespace);

            res.json(config[0]);
        });


    });




};