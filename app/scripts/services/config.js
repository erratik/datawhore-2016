// public/core.js
var app = angular.module('services.Config', []);



app.service('ConfigService', function ($http, $q){
    var ConfigService = {};

    ConfigService.getProfile = function(options){  
        var params = {
            namespace: options.namespace,
            loadConfig : options.loadConfig || false
        };

        var url = (params.namespace) ? '/api/config/'+params.namespace : '/api/configs' ;
        // console.log(this.getPosts({namespace: 'instagram', count: 1}));
        return $http.get(url).
            then(function(response) {
                if (params.namespace) {
                    console.log(':: ConfigService ::  getProfile (single) ');
                    // console.log(data);
                    var data = response.data;

                    delete data.props;
                    var config = buildProfile({profile: data, loadConfig: params.loadConfig});
                    // console.log(config);
                    return config;
                } else {
                    console.log(':: ConfigService ::  getProfile (all) ');
                    var configs = {};

                    for (var i = 0; i < response.data.length; i++) {
                        configs[response.data[i].name] = buildProfile({profile:response.data[i], loadConfig: params.loadConfig});
                    };

                    return configs;
                }
        });            
    }

    ConfigService.getConfig = function(namespace){  

        var url = '/api/config/config/'+namespace;
        // var url = (params.namespace) ? '/api/config/'+params.namespace : '/api/configs' ;
        // console.log(this.getPosts({namespace: 'instagram', count: 1}));
        console.log(url);
        return $http.get(url).
            then(function(response) {
                // if (params.namespace) {
                    var data = response.data;
                    console.log(':: ConfigService ::  getProfileConfig (single) ');

                    console.log(data);
                    return data;
        });            
    }
    
    
    ConfigService.cleanProfile = function(options){  
        var params = {
            namespace: options.namespace
        };
        return $http.get('/api/' + params.namespace + '/config').
        then(function(response) {
            var data = response.data;
            // var postConfig = makeParent(response.data.posts[0], {});

        console.log(data);
            return data;
        });            
    }

    ConfigService.getPosts = function(options){  
        var params = {
            namespace: options.namespace,
            count: options.count
        };
        // console.log(params);
        return $http.post('/api/' + params.namespace + '/posts/'+ params.count, params).
        then(function(response) {
                
            var postConfig = makeParent(response.data.posts[0], {});

            return postConfig;
        });            
    }

    ConfigService.update = function(namespace, formData){   
        return $http.post('/api/config/update/' + namespace, formData).
        then(function(response) {
            var data = response.data;
            // data.formData = formData;
            // console.log(data);

            return data;
        });            
        return formData;

    }


    ConfigService.delete = function(namespace){            
        return $http.delete('/api/configs/' + namespace).
        then(function(response) {
            // console.log(response.data); //I get the correct items, all seems ok here
            return (response.data);
            // console.log(profileService);
        });            
    }


    return ConfigService;
});