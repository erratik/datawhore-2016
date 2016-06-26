module.exports = function (app) {
    app
        .service('ConfigService', ['$http', '$q', '$log', function ($http, $q, $log) {
            var ConfigService = {};

            ConfigService.getConfig = function (name) {

                return $http.get('/api/profile/config/' + name).then(function (response) {
                    console.log(response);
                    var data = response.data;
                    //console.debug('[ConfigService] getConfig (' + name + ') ');
                    //console.info(data);
                    return data;
                });
            };


            ConfigService.cleanConfig = function (options) {
                //console.log(options);
                return $http.get('/api/' + options.namespace + '/fetch/' + options.type).then(function (response) {
                    var data = response.data;
                    console.info(data);
                    return data;
                });
            };

            ConfigService.update = function (namespace, type, config) {

                return $http.post('/api/config/update/' + namespace + '/' + type, config).then(function (response) {
                    var data = response.data;
                    console.info(data);
                    return data;
                });
                //return formData;

            };

            //ConfigService.getPosts = function(options){
            //    var params = {
            //        namespace: options.namespace,
            //        count: options.count
            //    };
            //    // //console.log(params);
            //    return $http.post('/api/' + params.namespace + '/posts/'+ params.count, params).
            //    then(function(response) {
            //
            //        var postConfig = makeParent(response.data.posts[0], {});
            //
            //        return postConfig;
            //    });
            //};


            return ConfigService;
        }]);

};