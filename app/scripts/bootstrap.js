/**
 * bootstraps angular onto the window.document node
 * NOTE: the ng-app attribute should not be on the index.html when using ng.bootstrap
 */

module.exports = function (angular) {

    return angular.bootstrap(document, ['app']);

};