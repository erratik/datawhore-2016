var app = angular.module('app', [
    'ui.router',
    //'angoose.client',
    'angularMoment',
    'angular.filter',
    'angularify.semantic',

    'controllers.Settings',
    'controllers.Config',
    //'controllers.Networks',
    'services.Profile',
    'services.Core',
    'services.Config'

]);

// use unix timestamps in angular views
app.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
}).config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('settings', {
        url: '/settings',
        controller: 'settingsController as settings',
        templateUrl: 'templates/tpl--settings.html'
    }).state('networks', {
        url: '/',
        controller: 'networksController',
        templateUrl: 'templates/tpl--profiles.html',
        resolve: {
            networks: function(CoreService) {
                //console.log(CoreService.getNetworkConfigs({namespace: false}));
                return CoreService.getNetworks({namespace: false});
                // return ConfigService.load($stateParams.namespace);
            },
            configs: function(ConfigService) {
                return ConfigService.getNetworkConfig({namespace: false, loadConfig: 'soft'});
                // return ConfigService.load($stateParams.namespace);
            }
        }
    }).state('config', {
        url: '/config/:namespace',
        controller: 'configController',
        templateUrl: 'templates/tpl--profile.html',
        resolve: {
            config: function(ConfigService, $stateParams) {
                //console.log(ConfigService.getNetworkConfig({namespace: $stateParams.namespace, loadConfig: true}));
                return ConfigService.getNetworkConfig({namespace: $stateParams.namespace, loadConfig: true});
                // return ConfigService.load($stateParams.namespace);
            },
            profile: function(ConfigService, $stateParams) {
                return ConfigService.getProfileConfig( $stateParams.namespace );
                // return ConfigService.load($stateParams.namespace);
            }
        }
    });
}]);


app.filter('typeof', function(){
    return function(context){
        return typeof context;
    }
});
app.filter('length', function(){
    return function(context){
        // console.log(context.length);
        return (typeof context == "object") ? Object.keys(context).length : '';
    }
});
app.filter('fromNow', function(){
    return function(date){
        return moment.unix(date).fromNow();
    }
});
app.filter('orderObjectBy', function(){
    return function(input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for(var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function(a, b){
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});

var makeParent = function(nodeParent, objParent) {
    // var obj;
    var _nodeKeys = Object.keys(nodeParent);
    for (var i = 0; i < _nodeKeys.length; i++) {

        var content = nodeParent[_nodeKeys[i]];
        if (content !== null ) {
            var that = nodeParent[_nodeKeys[i]];
            objParent[_nodeKeys[i]] = makeData(that, _nodeKeys[i]);
            // console.log(Object.keys(that.content.value));
            var injected = objParent[_nodeKeys[i]];

            if (injected.grouped
                && typeof injected.content.value == 'object'
                || typeof injected.content.value == 'array') {
                objParent[_nodeKeys[i]].content = makeParent(injected.content.value, {});
            }

        }
    };
    return objParent;
};

var makeData = function(val, label){
    var obj = {
        content: {
            enabled: false,
            label: label,
            value: val
        }

    };
    var thisVal = obj.content.value;
    obj.grouped = (typeof thisVal == 'array' || typeof thisVal == 'object') ? true : false;

    return obj;
};

Object.prototype.countProperties = function(foo) {
    var count = 0;
    for (var k in foo) {
        if (foo.hasOwnProperty(k)) {
            ++count;
        }
    }
    return count;

};

var buildProfileInfo = function(profile) {

    var profileInfo = {
        avatar: profile.avatar,
        last_modified: profile.last_modified,
        name: profile.name,
        username: profile.username
    };

    return profileInfo;
};

var buildConfig = function(network) {


    var _nfo = {};
    //
    //var profileConfig = (network.profileConfig) ? network.profileConfig : makeParent(network.fetchedProfile, {});
    ////var postConfig = (network.postConfig) ? network.postConfig : makeParent(network.fetchedProfile, {});

    _nfo.profileConfig = network.profileConfig;
    _nfo.postConfig = network.postConfig;

    return _nfo;
};


Object.prototype.foo = function() {
    console.log('fooooo');
}
