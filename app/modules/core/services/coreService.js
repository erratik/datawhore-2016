
define(function() {
    var app = angular.module('CoreService', []);

    app.service('CoreService', function ($http, $q) {
        var CoreService = {};


        CoreService.getNetworks = function (options) {
            var params = {
                namespace: options.namespace,
                loadConfig: options.loadConfig || false
            };

            var url = (params.namespace) ? '/api/core/' + params.namespace : '/api/core';
            return $http.get(url).
                then(function (response) {
                    var data = response.data;
                    if (params.namespace) {
                        //console.log(':: CoreService ::  getNetworks (single) ');
                    } else {
                        //console.log(':: CoreService ::  getNetworks (all) ');
                    }
                    ////console.log(data);
                    return data;
                });
        };


        // CoreService.update = function(namespace, formData){

        //     return $http.post('/api/profile/update/' + namespace, formData).
        //     then(function(response) {
        //         var data = response.data;
        //         data.formData = formData;
        //         // //console.log(response.data);
        //         return (response.data);
        //     });
        //     return formData;

        // }


        // CoreService.delete = function(namespace){
        //     return $http.delete('/api/profiles/' + namespace).
        //     then(function(response) {
        //         // //console.log(response.data); //I get the correct items, all seems ok here
        //         return (response.data);
        //         // //console.log(profileService);
        //     });
        // }


        return CoreService;
    });

});