// public/core.js
var app = angular.module('services.Profile', [
    'angularMoment'
]);



app.service('ProfileService', function ($http, $q){
    var ProfileService = {};

     //ProfileService.getProfile = function(options){
     //    var params = {
     //        namespace: options.namespace,
     //        loadConfig : options.loadConfig || false
     //    };
     //
     //    var url = (params.namespace) ? '/api/profile/'+params.namespace : '/api/profiles' ;
     //    // console.log(this.getPosts({namespace: 'instagram', count: 1}));
     //    return $http.get(url).
     //        then(function(response) {
     //            if (params.namespace) {
     //                console.log(':: ProfileService ::  getProfile (single) ');
     //                // console.log(data);
     //                var data = response.data;
     //                var profile = buildProfile({profile: data, loadConfig: params.loadConfig});
     //                // console.log(profile);
     //                return profile;
     //            } else {
     //                console.log(':: ProfileService ::  getProfile (all) ');
     //                var profiles = {};
     //
     //                for (var i = 0; i < response.data.length; i++) {
     //                    profiles[response.data[i].name] = buildProfile({profile:response.data[i], loadConfig: params.loadConfig});
     //                };
     //
     //                return profiles;
     //            }
     //    });
     //}


    ProfileService.getPosts = function(options, sample){
        sample = (sample !== undefined) ? true : false;
        var params = {
            namespace: options.namespace,
            count: options.count
        };
        return $http.post('/api/' + params.namespace + '/fetch/posts/'+params.count+'/'+sample).
        then(function(response) {
            var data = response.data;
            //console.log(data);
            return data;
        });
    };

    ProfileService.update = function(namespace, formData, configType){

        return $http.post('/api/profile/update/' + namespace+ '/'+configType, formData).
        then(function(response) {
            var data = response.data;
            // data.formData = formData;
             console.log(data);

            return data;
        });
        //return formData;

    };


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