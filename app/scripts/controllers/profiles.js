// public/core.js
var app = angular.module('controllers.Profiles', [
    'angularMoment', 

    'directives.profileUpdated', 
    // 'directives.profileUpdate', 
    'directives.profileRemove', 
    'directives.profileUsername',
    'directives.profileAvatar',
    'directives.profileFetch'
]);



app.service('ProfileService', function ($http, $q){
    var ProfileService = {};

    ProfileService.load = function(namespace){   
        namespace = typeof namespace !== 'undefined' ? namespace : false;   
        // if (namespace) {
            var url = (namespace) ? '/api/profile/'+namespace : '/api/profiles' ;
            return $http.get(url).
            then(function(response) {
                var data = response.data;
                data.formData = {};
                if (!namespace) {
                    profilesData = {formData : {}};
                    var profiles = Object.keys(response.data.profiles);
                    for (var i = 0; i < profiles.length; i++) {
                       profilesData.formData[profiles[i]] = {};
                    };
                }

                var setValues = function(profileValues, formData, content, callback){
                    // console.log(content);
                    for (var j = 0; j < profileValues.length; j++) {
                        var savedValue = content.fetchedProfile[profileValues[j]] ;

                        formData[profileValues[j]] = {};
                        formData[profileValues[j]] = {
                            value: savedValue
                        };
                    }

                    if (typeof content.props != 'undefined' ) {
                        var profileProps = Object.keys(content.props);
                        for (var i = 0; i < profileProps.length; i++) {
                            if (typeof formData[profileProps[i]] != 'undefined') {
                                formData[profileProps[i]].displayName = content.props[profileProps[i]].displayName;
                                formData[profileProps[i]].enabled = true;
                            }
                        }
                    }
                    //console.log(formData);
                    callback(formData);
                };

                if (namespace) {
                    setValues(Object.keys(data.profile.fetchedProfile), data.formData, data.profile, function(formData){
                        data.formData = formData;
                    });
                } else {
                    for (var i = 0; i < profiles.length; i++) {
                        setValues(Object.keys(response.data.profiles[profiles[i]].props), profilesData.formData[profiles[i]], response.data.profiles[profiles[i]], function(formData){
                            data.formData[profiles[i]] = formData;
                        });
                    };
                }
                return data;
            });      
    }

    // FETCHING A NEW PROFILE FROM THE NETWORK
    ProfileService.update = function(namespace){            
        return $http.post('/api/profiles/' + namespace).
        then(function(response) {
            return (response.data);
        });            
    }
    ProfileService.delete = function(namespace){            
        return $http.delete('/api/profiles/' + namespace).
        then(function(response) {
            // console.log(response.data); //I get the correct items, all seems ok here
            return (response.data);
            // console.log(profileService);
        });            
    }

    ProfileService.updateProps = function(namespace, enabling, formData){   

            // console.log(':: updateProfileProps');
            // console.log($scope.formData);
            var properties = Object.keys(formData)

            console.log(formData);
            // console.log(':: updateProfileProps > properties');
            for (var i = 0; i < properties.length; i++) {
                // console.log($scope.formData[properties[i]]);
                if (!formData[properties[i]].enabled == 'off') delete $scope.formData[properties[i]];
            };         

            console.log(formData);

            return $http.post('/api/profile/props/' + namespace, {data:formData, enabling: enabling}).
            then(function(response) {
                var data = response.data;
                data.formData = formData;
                console.log(response.data);
                return (response.data);
            });            

            // $http.post('/api/profile/props/' + namespace, $scope.formData).success(function(data) {
            //     console.log(data);
            //     $scope.profile = data;
            // }).error(function(data) {
            //     console.log('Error: ' + data);
            // });
    }

    return ProfileService;
});

app.controller('profilesController', ['$scope', '$http', 'ProfileService', function profilesController($scope, $http, ProfileService) {
    // console.log(this);

    $scope.ProfileService = angular.copy(ProfileService);

    // $scope.profiles.load();
    $scope.ProfileService.load().then(function(items){
       $scope.model = items;
       $scope.formData = items.formData;
            console.log($scope);
            init();
    });

    // when submitting the add form, send the text to the node API
    $scope.getProfile = function(namespace) {
        // $scope.model = fetchProfile.getobject(namespace);
        $scope.ProfileService.update(namespace).then(function(items){
            $scope.model.profiles[namespace] = items.profile;
            $scope.model.configs[namespace] = items.config;
        });
    };

        $scope.updateProfileProps = function(namespace) {
            $scope.ProfileService.updateProps(namespace, false, $scope.formData[namespace]).then(function(items){
                // $scope.model.profiles[namespace] = items.profile;
                // $scope.model.configs[namespace] = items.config;
                console.log(items);
            });
        };

}]);
app.controller('profileController', ['$scope', '$http',  '$stateParams', 'ProfileService', function profilesController($scope, $http, $stateParams, ProfileService) {
        // Setting up the scope's data -------------------------------------------------------*/
        $scope.network = $stateParams.namespace;
        $scope.ProfileService = angular.copy(ProfileService);
        $scope.formData = {};

        $scope.ProfileService.load($scope.network).then(function(data){
            $scope.hidden = true;
            $scope.profile = data.profile;
            $scope.config = data.config;
            $scope.formData = data.formData;
            //console.log($scope.formData);
        });

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
            //console.log(':: getProfile');
            // $scope.model = fetchProfile.getobject(namespace);
            $scope.ProfileService.update(namespace).then(function(data){
                $scope.profile = data.profile;
                $scope.config = data.config;
            });
        };

           
        $scope.updateProfileProps = function(namespace) {
            $scope.ProfileService.updateProps(namespace, true, $scope.formData).then(function(items){
                // $scope.model.profiles[namespace] = items.profile;
                // $scope.model.configs[namespace] = items.config;
                console.log(items);
            });
        
        };

    }
]);
