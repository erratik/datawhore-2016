module.exports = function (app) {
    // require('./version')(app);
    require('./coreService')(app);
    require('./configService')(app);
    require('./profileService')(app);
};