module.exports = function (app) {
    require('./configController')(app);
    require('./coreController')(app);
};
