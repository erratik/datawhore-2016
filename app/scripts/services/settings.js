// public/core.js
var app = angular.module('services.Settings', [
    'angularMoment', 
]);



app.service('SettingsService', function ($http, $q){
    var SettingsService = {};


    SettingsService.getNetworkConfigs = function(options){  
        var params = {
            namespace: options.namespace,
            loadConfig : options.loadConfig || false
        };

        var url = (params.namespace) ? '/api/settings/'+params.namespace : '/api/settings' ;
        return $http.get(url).
            then(function(response) {
                var data = response.data;
                if (params.namespace) {
                    console.log(':: SettingsService ::  getSettings (single) ');

                } else {
                    console.log(':: SettingsService ::  getSettings (all) ');

                    
                }
                return data;
        });            
    }


    // SettingsService.update = function(namespace, formData){   

    //     return $http.post('/api/profile/update/' + namespace, formData).
    //     then(function(response) {
    //         var data = response.data;
    //         data.formData = formData;
    //         // console.log(response.data);
    //         return (response.data);
    //     });            
    //     return formData;

    // }


    // SettingsService.delete = function(namespace){            
    //     return $http.delete('/api/profiles/' + namespace).
    //     then(function(response) {
    //         // console.log(response.data); //I get the correct items, all seems ok here
    //         return (response.data);
    //         // console.log(profileService);
    //     });            
    // }


    return SettingsService;
});