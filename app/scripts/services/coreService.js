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


        CoreService.connectNetwork = function (namespace, oauthParams) {
            var url = '/api/connect/' + namespace+'/'+oauthParams.api_key.value+'/'+oauthParams.api_secret.value;
            //console.debug(url);
            return $http.get(url, oauthParams ).
                then(function (response) {
                    var url = response.data;
                    console.debug(url);
                    window.location = url;
                    //return data;
                });
        };

        CoreService.addNetwork = function (namespace, type) {

            return $http.post('/api/core/add/' + namespace).
                then(function (response) {
                    var data = response.data;
                    console.debug(':: CoreService ::  addNetwork ('+namespace+') ');
                    console.info(data);
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

        CoreService.removeNetwork = function (namespace, type) {

            return $http.post('/api/core/remove/' + namespace).
                then(function (response) {
                    var data = response.data;
                    console.debug(':: CoreService ::  removeNetwork ('+namespace+') ');
                    console.info(data);
                    return data;
                });
        };

        return CoreService;
    });

});