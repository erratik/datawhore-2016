// public/core.js
var app = angular.module('services.Profile', [
    'angularMoment', 
]);



app.service('ProfileService', function ($http, $q){
    var ProfileService = {};

    ProfileService.getProfile = function(options){  
        var params = {
            namespace: options.namespace,
            loadConfig : options.loadConfig || false
        };

        var url = (params.namespace) ? '/api/profile/'+params.namespace : '/api/profiles' ;
        // console.log(this.getPosts({namespace: 'instagram', count: 1}));
        return $http.get(url).
            then(function(response) {
                if (params.namespace) {
                    console.log(':: ProfileService ::  getProfile (single) ');
                    // console.log(data);
                    var data = response.data;
                    var profile = buildProfile({profile: data, loadConfig: params.loadConfig});
                    // console.log(profile);
                    return profile;
                } else {
                    console.log(':: ProfileService ::  getProfile (all) ');
                    var profiles = {};

                    for (var i = 0; i < response.data.length; i++) {
                        profiles[response.data[i].name] = buildProfile({profile:response.data[i], loadConfig: params.loadConfig});
                    };

                    return profiles;
                }
        });            
    }

    ProfileService.getConfig = function(namespace){  

        var url = '/api/profile/config/'+namespace;
        // var url = (params.namespace) ? '/api/profile/'+params.namespace : '/api/profiles' ;
        // console.log(this.getPosts({namespace: 'instagram', count: 1}));
        console.log(url);
        return $http.get(url).
            then(function(response) {
                // if (params.namespace) {
                    var data = response.data;
                    console.log(':: ProfileService ::  getProfileConfig (single) ');

                    console.log(data);
                    return data;
                // } else {
                //     console.log(':: ProfileService ::  getProfile (all) ');
                //     var profiles = {};

                //     for (var i = 0; i < response.data.length; i++) {
                //         profiles[response.data[i].name] = buildProfile({profile:response.data[i], loadConfig: params.loadConfig});
                //     };

                //     return profiles;
                // }
        });            
    }
    
    
    ProfileService.cleanProfile = function(options){  
        var params = {
            namespace: options.namespace
        };
        return $http.get('/api/' + params.namespace + '/profile').
        then(function(response) {
            var data = response.data;
            // var postConfig = makeParent(response.data.posts[0], {});

        console.log(data);
            return data;
        });            
    }

    ProfileService.getPosts = function(options){  
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

    ProfileService.update = function(namespace, formData){   
        return $http.post('/api/profile/update/' + namespace, formData).
        then(function(response) {
            var data = response.data;
            // data.formData = formData;
            // console.log(data);
            
            return data;
        });            
        return formData;

    }


    ProfileService.delete = function(namespace){            
        return $http.delete('/api/profiles/' + namespace).
        then(function(response) {
            // console.log(response.data); //I get the correct items, all seems ok here
            return (response.data);
            // console.log(profileService);
        });            
    }


    return ProfileService;
});