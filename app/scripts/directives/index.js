module.exports = function (app) {
    // require('./app-version')(app);
    require('./namespace')(app, './templates/directives/');
    require('./posts')(app);
    require('./profile')(app);
    require('./tabs')(app);
};
