// public/core.js
var app = angular.module('services.Config', []);



app.service('ConfigService', function ($http, $q){
    var ConfigService = {};

    ConfigService.getNetworkConfig = function(options){
        var params = {
            namespace: options.namespace,
            loadConfig : options.loadConfig || false
        };

        var url = (params.namespace) ? '/api/config/network/'+params.namespace : '/api/configs/network' ;
        // console.log(this.getPosts({namespace: 'instagram', count: 1}));
        return $http.get(url).
            then(function(response) {
                if (params.namespace) {
                    console.log(':: ConfigService ::  getNetworkConfig ('+params.namespace+') ');
                    var data = response.data;

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
                } else {
                    console.log(':: ConfigService ::  getNetworkConfig (all) ');
                    var configs = {};

                    for (var i = 0; i < response.data.length; i++) {

                        configs[response.data[i].name] = {};
                        configs[response.data[i].name].profileInfo = buildProfileInfo(response.data[i]);

                        if (params.loadConfig == 'soft') {
                            console.log('> soft loaded config with profileInfo:'+response.data[i].name);
                            if (response.data[i].postConfig !== undefined)  {
                                configs[response.data[i].name].postConfig = true;
                            }
                            if (response.data[i].profileConfig !== undefined)  {
                                configs[response.data[i].name].profileConfig = true;
                            }
                        } else {
                            // todo: this won't really ever happen... hopefully
                            //configs[response.data[i].name] = buildProfile({profile:response.data[i], loadConfig: params.loadConfig});
                            console.log('> loaded config with profileInfo:'+response.data[i].name);
                        }

                    };

                    return configs;
                }
        });            
    };

    ConfigService.getProfileConfig = function(namespace){

        var url = '/api/config/profile/'+namespace;
        // var url = (params.namespace) ? '/api/profile/'+params.namespace : '/api/profiles' ;
        // console.log(this.getPosts({namespace: 'instagram', count: 1}));
        //console.log('testjkjkljkjl');
        return $http.get(url).
        then(function(response) {
            // if (params.namespace) {
            var data = response.data;
            console.log(':: ProfileService ::  getProfileConfig ('+namespace+')');

            return data;
        });
    };

    ConfigService.cleanConfig = function(options){
        var params = {
            namespace: options.namespace,
            configType: options.configType
        };
        return $http.get('/api/' + params.namespace + '/fetch/'+params.configType).
        then(function(response) {
            var data = response.data;
            //console.log(data);
            return data;
        });            
    };

    ConfigService.update = function(namespace, formData, configType){
        return $http.post('/api/config/update/' + namespace+'/'+configType, formData).
        then(function(response) {
            var data = response.data;
            return data;
        });            
        return formData;

    };


    //ConfigService.getPosts = function(options){
    //    var params = {
    //        namespace: options.namespace,
    //        count: options.count
    //    };
    //    // console.log(params);
    //    return $http.post('/api/' + params.namespace + '/posts/'+ params.count, params).
    //    then(function(response) {
    //
    //        var postConfig = makeParent(response.data.posts[0], {});
    //
    //        return postConfig;
    //    });
    //};


    ConfigService.delete = function(namespace){            
        return $http.delete('/api/configs/' + namespace).
        then(function(response) {
            // console.log(response.data); //I get the correct items, all seems ok here
            return (response.data);
            // console.log(profileService);
        });            
    };


    return ConfigService;
});