module.exports = function (app) {
    // require('./app-version')(app);
    require('./namespace')(app, './templates/directives/');
    require('./profile')(app, './templates/directives/');
    require('./posts')(app);
    require('./tabs')(app);
};
