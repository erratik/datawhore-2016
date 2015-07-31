// public/core.js
var app = angular.module('controllers.Profiles', [
    'angularMoment', 
    'directives.profileUpdated', 
    'directives.profileRemove', 
    'directives.profileAvatar',
    'directives.profileFetch'
]);

app.service("profileSettings", function(){
    this.dataContainer = {
      valA : "car",
      valB : "bike"
    }
  })
  .controller("testCtrl", [
    "$scope",
    "myDataService",
    function($scope, myDataService){
      $scope.data = function(){
        return myDataService.dataContainer;
      };
  }]);
app.controller('profilesController', ['$scope', '$http', 'profileSettings',function profilesController($scope, $http    ) {
    // console.log(this);
    // when landing on the page, get all profiles and show them
    $http.get('/api/profiles').success(function(data) {
        // console.log(data);
        $scope.model = data;
        console.log($scope);
    }).error(function(data) {
        console.log('Error: ' + data);
    });
    // when submitting the add form, send the text to the node API
    $scope.getProfile = function(namespace) {
        console.log('getProfile');
        // post goes to each network's api routes js
        $http.post('/api/profiles/' + namespace, {
            configs: $scope.model.configs,
            profiles: $scope.model.profiles
        }).success(function(data) {
            // console.log(data);
            // TODO: Tay - make sure there's a reason im sending all this data back and forth?!
            $scope.model = data;
            console.log($scope);
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };
    // delete a setting after checking it
    $scope.deleteProfile = function(namespace) {
        $http.delete('/api/profiles/' + namespace, {
            profiles: $scope.model.profiles
        }).success(function(data) {
            delete $scope.model.profiles[namespace];
            $scope.model.configs[namespace].profile = false;
            console.log(data);
            console.log($scope.model);
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };
}]);
app.controller('profileController', ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http) {
        $scope.network = $stateParams.namespace;
        $scope.formData = {};

        // when landing on the page, get all profiles and show them
        $http.get('/api/profile/' + $scope.network).success(function(data) {
            $scope.profile = data;
            // $scope.formData[$stateParams.namespace] = {};
            var profileValues = Object.keys(data.fetchedProfile);
            for (var j = 0; j < profileValues.length; j++) {
                $scope.formData[profileValues[j]] = {};
                var savedValue = data.fetchedProfile[profileValues[j]];
                $scope.formData[profileValues[j]] = {
                    value: savedValue
                };
            }
            if (typeof data.props != 'undefined') {
                var profileProps = Object.keys(data.props);
                // console.log(data)
                for (var i = 0; i < profileProps.length; i++) {
                    if (typeof $scope.formData[profileProps[i]] != 'undefined') {
                        $scope.formData[profileProps[i]].displayName = data.props[profileProps[i]].displayName;
                        $scope.formData[profileProps[i]].enabled = true;
                    }
                }
            }
            $scope.hidden = true;
            $scope.profile = data;
            console.log($scope);
        }).error(function(data) {
            console.log('Error: ' + data);
        });

        $scope.updateProfileProps = function(namespace) {
            console.log('updateProfileProps');
            var properties = Object.keys($scope.formData)

            for (var i = 0; i < properties.length; i++) {
                if (!$scope.formData[properties[i]].enabled) delete $scope.formData[properties[i]];

            };

            $http.post('/api/profile/props/' + namespace, $scope.formData).success(function(data) {
                console.log(data);
                $scope.profile = data;

            }).error(function(data) {
                console.log('Error: ' + data);
            });
        };
    }
]);