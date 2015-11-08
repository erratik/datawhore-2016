// public/core.js
var app = angular.module('services.Settings', [
    'angularMoment', 
]);



app.service('SettingsService', function ($http, $q){
    var SettingsService = {};

    SettingsService.load = function(){   

        var url = '/api/settings' ;
        return $http.get(url).
        then(function(response) {
            var data = response.data;
            // data.formData = {};


            return data;
        });      
    }

    // UPATING SETTINGS
    SettingsService.update = function(settings){            
        var url = '/api/settings' ;
        return $http.post(url, {settings: settings}).
        then(function(response) {
            return (response.data);
        });            
    }
    // SettingsService.delete = function(namespace){            
    //     return $http.delete('/api/profiles/' + namespace).
    //     then(function(response) {
    //         // console.log(response.data); //I get the correct items, all seems ok here
    //         return (response.data);
    //         // console.log(SettingsService);
    //     });            
    // }

    // SettingsService.updateProps = function(namespace, enabling, formData){   

    //         // console.log(':: updateProfileProps');
    //         // console.log($scope.formData);
    //         var properties = Object.keys(formData)

    //         // console.log(formData);
    //         // console.log(':: updateProfileProps > properties');
    //         for (var i = 0; i < properties.length; i++) {
    //             // console.log($scope.formData[properties[i]]);
    //             if (!formData[properties[i]].enabled == 'off') delete $scope.formData[properties[i]];
    //         };         

    //         // console.log(formData);

    //         return $http.post('/api/profile/props/' + namespace, {data:formData, enabling: enabling}).
    //         then(function(response) {
    //             var data = response.data;
    //             data.formData = formData;
    //             // console.log(response.data);
    //             return (response.data);
    //         });            

    //         // $http.post('/api/profile/props/' + namespace, $scope.formData).success(function(data) {
    //         //     console.log(data);
    //         //     $scope.profile = data;
    //         // }).error(function(data) {
    //         //     console.log('Error: ' + data);
    //         // });
    // }

    return SettingsService;
});