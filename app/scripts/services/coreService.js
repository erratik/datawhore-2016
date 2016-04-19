define(['./module'], function (services) {
    'use strict';
    services.service('CoreService', function ($http, $q) {
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


        CoreService.connectNetwork = function (namespace) {
            namespace = typeof namespace == 'undefined' ? false : namespace;
            var url = (namespace) ? '/api/core/' + namespace : '/api/core';
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

        CoreService.updateNetwork = function (namespace, settings) {

            return $http.post('/api/core/update/' + namespace, settings).
                then(function (response) {
                    var data = response.data;
                    console.debug(':: CoreService ::  updateNetwork ('+namespace+') ');
                    console.info(data);
                    return data;
                });
        };

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