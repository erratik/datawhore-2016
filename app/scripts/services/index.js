module.exports = function (app) {
    require('./networkService')(app);
    require('./coreService')(app);
    require('./configService')(app);
    require('./profileService')(app);
};