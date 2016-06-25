module.exports = function (app, tpl_folder) {
    app
        .directive('profileAsset', function () {
            return {
                restrict: 'E',
                scope: {
                    namespace: "=",
                    profile: "=",
                    classes: "@",
                    username: "=",
                    type: '@'
                },
                templateUrl: tpl_folder + 'profile--avatar.html',
                link: function (scope, element, attrs) {
                    if (scope.type != 'avatar' && scope.username != undefined) {
                        element.find('span').html('@' + scope.username + '');
                    } else if (scope.type != 'avatar' && scope.username == undefined) {
                        element.find('span').html(scope.namespace);
                    }
                }
            };
        })
        .directive('profileCard', function () {
            return {
                replace: true,
                restrict: 'E',
                scope: {
                    configs: "=",   
                    networks: "="
                },
                templateUrl: tpl_folder + 'profile--card.html',
                link: function (scope, element, attrs) {
                    // element.prepend('<tr><th id="par" class="span" colspan="5" scope="colgroup">Attribute</th></tr>');
                }
            };
        })
        .directive('profileUpdated', ['moment', function (moment) {
            return {
                restrict: 'E',
                scope: {
                    date: '='
                },
                template: 'No profile saved.',
                link: function (scope, element, attrs) {

                    if (scope.date)
                        element.html('Last saved ' + moment.unix(scope.date).fromNow());

                }
            };
        }]);

};
