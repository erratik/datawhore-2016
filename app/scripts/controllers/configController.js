module.exports = function (app) {
    app
        .controller('configController', ['$scope', '$http', '$stateParams', 'ConfigService', 'ProfileService', 'profile', 'config',
            function configController($scope, $http, $stateParams, ConfigService, ProfileService, profile, config) {

                $scope.profileInfo = {
                    last_modified: config.last_modified,
                    name: $stateParams.namespace
                };

                $scope.formData = {
                    profileConfig: config.profileConfig,
                    postConfig: config.postConfig,
                    profileProperties: profile.profileProperties,
                    postProperties: profile.postProperties
                };

                $scope.sortType = 'data.label';
                $scope.sortReverse = false;

                ProfileService.getPosts({namespace: $stateParams.namespace, count: 1}, true).then(function (response) {
                    $scope.post = response;
                });

                $scope.updateConfig = function (type) {
                    var config =  $scope.formData[type+'Config'];
                    ConfigService.update($scope.profileInfo.name, type, config).then(function (data) {
                        $scope.formData[type+'Config'] = data.config;
                        $scope.formData[type+'Properties'] = data.properties;
                    });
                };

                $scope.updateProperties = function (type) {
                    ProfileService.update($scope.profileInfo.name, $scope.formData[type + 'Properties'], type).then(function (data) {
                        config[type + 'Properties'] = data;
                    });
                };


                // when submitting the add form, send the text to the node API
                $scope.cleanConfig = function (type) {
                    //$scope.show_modal = true;

                    ConfigService.cleanConfig({
                        namespace: $scope.profileInfo.name,
                        type: type
                    }).then(function (data) {
                        //console.info(data);
                        $scope.formData[type+'Config']= data.config;
                        $scope.formData[type+'Properties'] = data.properties;
                        console.info($scope.formData);

                        $scope.show_modal = false;
                    });
                };

                // when submitting the add form, send the text to the node API
                $scope.cleanPost = function (namespace) {
                    ConfigService.cleanPost({namespace: namespace}).then(function (data) {

                        $scope.formData.profileConfig = data.profileConfig;
                        $scope.formData.postConfig = data.postConfig;
                        $scope.formData.profileProperties = data.profileProperties;
                        $scope.formData.postProperties = data.postProperties;
                    });
                };
                //
                $scope.createEntity = function (label) {
                    //console.log('createEntity?');
                    //console.log(label);
                };

                $scope.show_modal = false;

                $scope.close_modal = function () {
                    $scope.show_modal = false;
                };

                $scope.open_modal = function () {
                    $scope.show_modal = true;
                };
            }
        ]);
};


