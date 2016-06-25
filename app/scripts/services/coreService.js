module.exports = function (app) {
    app
        .service('CoreService', function ($http, $q) {
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

        return CoreService;
    });

};