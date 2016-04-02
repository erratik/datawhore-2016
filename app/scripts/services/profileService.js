// public/core.js
var app = angular.module('services.Profile', [
    'angularMoment'
]);



app.service('ProfileService', function ($http, $q){


    this.getProfile = function(name) {

        return $http.get('/api/profile/properties/'+ name).
            then(function(response) {
                var data = response.data;
                console.log(':: ProfileService ::  getProfile ('+name+') ');
                console.log(data);
                return data;
            });
    };


    this.getPosts = function(options, sample){
        sample = (sample !== undefined) ? true : false;
        var params = {
            namespace: options.namespace,
            count: options.count
        };
        return $http.post('/api/' + params.namespace + '/fetch/posts/'+params.count+'/'+sample).
        then(function(response) {
            var data = response.data;
            ////console.log(data);
            return data;
        });
    };

    this.update = function(namespace, formData, configType){
        console.log(formData);
        return $http.post('/api/profile/update/' + namespace+ '/'+configType, formData).
        then(function(response) {
            var data = response.data;
            // data.formData = formData;
             //console.log(data);

            return data;
        });
        //return formData;

    };


    this.delete = function(namespace){
        return $http.delete('/api/profiles/' + namespace).
        then(function(response) {
            // //console.log(response.data); //I get the correct items, all seems ok here
            return (response.data);
            // //console.log(profileService);
        });            
    }


    return this;
});