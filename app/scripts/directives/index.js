module.exports = function (app) {
    require('./profileDisplayDirectives')(app, './templates/directives/');
    require('./tabs')(app);
};
