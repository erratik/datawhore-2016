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

        CoreService.getNetworkConfig = function(options){
            var params = {
                namespace: options.namespace,
                loadConfig : options.loadConfig || false
            };

            var url = (params.namespace) ? '/api/config/network/'+params.namespace : '/api/configs/network' ;
            // //console.log(this.getPosts({namespace: 'instagram', count: 1}));
            return $http.get(url).
                then(function(response) {
                    if (params.namespace) {
                        console.log(':: ConfigService ::  getNetworkConfig ('+params.namespace+') ');
                        var data = response.data;
                        console.log(data);

                        var config = {};
                        //var config = buildProfile({profile: data, loadConfig: params.loadConfig});
                        config.profileInfo = buildProfileInfo(data);

                        var configs = buildConfig(data);
                        var  _configkeys = Object.keys(buildConfig(data));
                        for (var i = 0; i < _configkeys.length; i++) {
                            config[_configkeys[i]] = configs[_configkeys[i]];
                        }
                        console.log(config);

                        return config;
                    }
                    else {
                        //console.log(':: ConfigService ::  getNetworkConfig (all) ');
                        var configs = {};

                        for (var i = 0; i < response.data.length; i++) {

                            configs[response.data[i].name] = {};
                            configs[response.data[i].name].profileInfo = buildProfileInfo(response.data[i]);

                            if (params.loadConfig == 'soft') {
                                //console.log('> soft loaded config with profileInfo:'+response.data[i].name);
                                if (response.data[i].postConfig !== undefined)  {
                                    configs[response.data[i].name].postConfig = true;
                                }
                                if (response.data[i].profileConfig !== undefined)  {
                                    configs[response.data[i].name].profileConfig = true;
                                }
                            } else {
                                // todo: this won't really ever happen... hopefully
                                //configs[response.data[i].name] = buildProfile({profile:response.data[i], loadConfig: params.loadConfig});
                                //console.log('> loaded config with profileInfo:'+response.data[i].name);
                            }

                        };

                        return configs;
                    }
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