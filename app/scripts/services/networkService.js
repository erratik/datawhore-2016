module.exports = function (app) {
    app
        .service('NetworkService', function ($http, $q) {
            var NetworkService = {};


            NetworkService.connectNetwork = function (namespace, oauthParams) {
                var url = '/api/connect/' + namespace + '/' + oauthParams.api_key.value + '/' + oauthParams.api_secret.value;
                //console.debug(url);
                return $http.get(url, oauthParams).then(function (response) {
                    var url = response.data;
                    console.debug(url);
                    window.location = url;
                    //return data;
                });
            };

            NetworkService.addNetwork = function (namespace, type) {

                return $http.post('/api/core/add/' + namespace).then(function (response) {
                    var data = response.data;
                    console.debug(':: NetworkService ::  addNetwork (' + namespace + ') ');
                    console.info(data);
                    return data;
                });
            };


            NetworkService.updateNetwork = function (namespace, settings) {

                return $http.post('/api/core/update/' + namespace, settings).then(function (response) {
                    var data = response.data;
                    console.debug(':: NetworkService ::  updateNetwork (' + namespace + ') ');
                    console.info(data);
                    return data;
                });
            };

            NetworkService.removeNetwork = function (namespace, type) {
                return $http.post('/api/core/remove/' + namespace).then(function (response) {
                    var data = response.data;
                    console.debug(':: NetworkService ::  removeNetwork (' + namespace + ') ');
                    console.info(data);
                    return data;
                });
            };

            return NetworkService;
        });

};