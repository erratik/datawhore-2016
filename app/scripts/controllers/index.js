module.exports = function (app) {
    require('./configController')(app);
    require('./profileController')(app);
    // require('./networkController')(app);
    require('./coreController')(app);
};
