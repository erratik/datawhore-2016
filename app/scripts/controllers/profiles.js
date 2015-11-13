// public/core.js
var app = angular.module('controllers.Profiles', [

    'directives.profileUpdated', 
    'directives.profileRemove', 
    'directives.profileUsername',
    'directives.profileAvatar',
    'directives.profileFetch',
    'directives.profileCard',
    'directives.profileRow'
]);


app.controller('profilesController', ['$scope', '$http', 'ProfileService', 'configs', 'profiles', function profilesController($scope, $http, ProfileService, configs, profiles) {

    $scope.configs = configs;
    $scope.profiles = profiles;

    // when submitting the add form, send the text to the node API
    $scope.cleanProfile = function(namespace) {
        //console.log('cleanProfile');
        ProfileService.cleanProfile({namespace: namespace}).then(function(data){
            // $scope.profiles[namespace]
            console.log(data);
        });
    };

}]);

app.controller('profileController', ['$scope', '$http',  '$stateParams', 'ProfileService', 'profileData', 'config',
    function profileController($scope, $http, $stateParams, ProfileService, profileData, config) {
        // Setting up the scope's data -------------------------------------------------------*/


        console.log($scope);
        $scope.hidden = true;
        $scope.config = config;
        $scope.formData = {};
        $scope.formData.profileConfig = profileData.profileConfig;
        $scope.formData.postConfig = profileData.postConfig;
        $scope.profileInfo = profileData.profileInfo;

        $scope.profileData = {};


        // var _configKeys = Object.keys($scope.formData.profileConfig);
        // for (var i = 0; i < _configKeys.length; i++) {
        //     var attrPath = 'formData.profileConfig.' + _configKeys[i];

        //     if (typeof $scope.formData.profileConfig[_configKeys[i]].content.enabled == 'boolean') {
                
        //         $scope.$watchCollection(
        //             attrPath+ '.content',
        //             function( newValue, oldValue ) {
        //                 // console.log( oldValue);
        //                 if (newValue.enabled) {
        //                     console.log( newValue.label + ' will be saved');

        //                 }
        //             }
        //         );
        //     }

        // }

        // // console.log(_deepConfigKeys);
        // // setTimeout(function(){

        // _deepConfigKeys = [];
        // for (var i = 0; i < _configKeys.length; i++) {
        //     if (typeof $scope.formData.profileConfig[_configKeys[i]].content.enabled != 'boolean') {
        //         _deepConfigKeys = Object.keys($scope.formData.profileConfig[_configKeys[i]].content);

        //     }
        // }

        // console.log(_deepConfigKeys);

        // for (var i = 0; i < $scope._deepConfigKeys.length; i++) {
        //         var deeperContent = $scope.formData.profileConfig[ $scope._deepConfigKeys[i]].content;
        //         var _depperContentKeys = Object.keys(deeperContent);
        //     // var attrPath = 'formData.profileConfig.' + _deepConfigKeys[i] + '.content.' + _depperContentKeys.content;

        //     // console.log($scope.formData.profileConfig[_configKeys[i]].content);
        //     // if (typeof $scope.formData.profileConfig[_configKeys[i]].content.enabled == 'boolean') {


        //         for (var j = 0; j < _depperContentKeys.length; j++) {
                    
        //             var deepAttrPath = 'formData.profileConfig.' +  $scope._deepConfigKeys[i] + '.content.'+ _depperContentKeys[j] + '.content';
        //             // var attrName = _depperContentKeys[j];
        //             console.log(deepAttrPath);

        //              $scope.$watchCollection(
        //                 deepAttrPath,
        //                 function( newValue, oldValue ) {
        //                     if (newValue.enabled) {
        //                         console.log( $scope.formData.profileConfig[$scope._deepConfigKeys[i]].content[_depperContentKeys[j]].label+'__'+newValue.label + ' will be saved');
        //                     }
        //                     // console.log( oldValue);
        //                 }
        //             );
        //         };
        //     // }
        // }


        // when submitting the add form, send the text to the node API
        $scope.deleteProfile = function(namespace) {
            //console.log(':: deleteProfile');
            $scope.ProfileService.delete(namespace).then(function(data){
                delete $scope.profile;
                $scope.config = data;
            });
        };

        // when submitting the add form, send the text to the node API
        $scope.getProfile = function(namespace) {
            ProfileService.getProfile({namespace: $scope.profileInfo.name}).then(function(data){
                $scope.profileInfo = data.profileInfo;
            });
        };
           
        $scope.updateProfile = function(namespace) {
            ProfileService.update($scope.profileInfo.name, $scope.formData).then(function(data){
                $scope.profileInfo.last_modified = data.last_modified;
            });
        
        };

        // when submitting the add form, send the text to the node API
        $scope.cleanProfile = function(namespace) {
            ProfileService.cleanProfile({namespace: namespace}).then(function(data){
                $scope.formData.profileConfig = data.profileConfig;
                $scope.formData.postConfig = data.postConfig;
            });
        };

        $scope.watchAttribute = function(attrPath) {


        };

    }
]);


