module.exports = function (app) {
    app
        .service('ProfileService', ['$http', '$log', function ($http, $log) {
            var ProfileService = {};

            ProfileService.getProfile = function (name) {

                return $http.get('/api/profile/properties/' + name).then(function (response) {
                    var data = response.data;
                    //console.debug('[ProfileService] getProfile (' + name + ') ');
                    //console.info(data);
                    return data;
                });
            };

            ProfileService.getPosts = function (options, sample) {
                sample = (sample !== undefined) ? true : false;
                var params = {
                    namespace: options.namespace,
                    count: options.count
                };
                return $http.post('/api/' + params.namespace + '/fetch/posts/' + params.count + '/' + sample).then(function (response) {
                    var data = response.data;
                    ////console.log(data);
                    return data;
                });
            };

            ProfileService.update = function (namespace, formData, type) {
                console.log(formData);
                return $http.post('/api/profile/update/' + namespace + '/' + type, formData).then(function (response) {
                    var data = response.data;
                    // console.debug('[ProfileService] update (' + namespace + ') ');
                    // console.info(data);
                    return data;
                });

            };

            return ProfileService;
        }]);

};