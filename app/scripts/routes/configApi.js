// load the setting model
var Settings = require('../models/Core');
var Config = require('../models/Config');
var Profile = require('../models/Profile');
var merge = require('merge'),
    original, cloned;
var mongoose = require('mongoose');
var moment = require('moment');
var flatten = require('flat');
var unflatten = require('flat').unflatten;
// expose the routes to our app with module.exports

module.exports = function(app) {

    //*****************************************************************/  
    //    Configs
    //*****************************************************************/

    // retrieve all network config -------------------------------------------------------*/
    app.get('/api/configs/network', function(req, res) {
        Config.get({}, function(config){

            ////console.log('>> @start Config.get()');
            ////console.log(config);
            ////console.log('>> /@end');

            res.json(config);
        });
        
    });

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

    // add/update network config -------------------------------------------------------*/
    app.post('/api/config/update/:namespace/:type', function(req, res) {

        ////console.log('>> @start Config.update({namespace: '+req.params.namespace+'})');
        ////console.log(config);
        ////console.log('>> /@end');

        var _config = new Config({name: req.params.namespace}); // instantiated Config

        _config.update({
            data: req.body[req.params.type+'Config'],
            type: req.params.type
        }, function(config) {
            console.log(config);
            //res.json(config);
        });
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

    // wipe config -------------------------------------------------------*/
    //app.delete('/api/configs/:namespace', function(req, res) {
    //    // //console.log('test');
    //    // get settings with mongoose, return default settings if !settings.saved
    //    Settings.findOne({
    //        name: 'settings'
    //    }, function(err, settings) {
    //        if (err) console.log(err);
    //        Config.remove({
    //            name: req.params.namespace
    //        }, function(err, config) {
    //            if (err) res.send(err);
    //            settings.configs[req.params.namespace]['config'] = false;
    //            Settings.updateConfig(settings.configs);
    //            res.json(settings.configs[req.params.namespace]);
    //        });
    //    });
    //});


};