var app = angular.module('app', [
    'ui.router', 
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

var buildProfile = function(options) {
    var params = {
        profile: options.profile || {},
        loadConfig: options.loadConfig
    };
    if (params.loadConfig == 'soft'){
        console.log('> soft loaded config with profileInfo:'+params.profile.name);
    } else if (params.loadConfig) {
        console.log('> loaded config with profileInfo:'+params.profile.name);
    }
    // console.log(params.profile);

    var _nfo = {
        profileInfo: {
            avatar: params.profile.avatar,
            last_modified: params.profile.last_modified,
            name: params.profile.name,
            username: params.profile.username
        }
    };

    var profileConfig = (params.profile.profileConfig) ? params.profile.profileConfig : makeParent(params.profile.fetchedProfile, {});
    var postConfig = (params.profile.postConfig) ? params.profile.postConfig : makeParent(params.profile.fetchedProfile, {});
    var profileProperties = (params.profile.profileProperties) ? params.profile.profileProperties : false;

    if (params.loadConfig == 'soft'){
        _nfo.profileConfig = (params.profile.profileConfig) ? true : false;
        _nfo.postConfig = (params.profile.postConfig) ? true : false;
    } else {

        _nfo.profileConfig = profileConfig;
        var _deletingKeys = Object.keys(_nfo.profileInfo);
        for (var i = 0; i < _deletingKeys.length; i++) {
            delete _nfo.profileConfig[_deletingKeys[i]];
        };
        delete _nfo.profileConfig['_id'];


        _nfo.postConfig = postConfig;
        if (profileProperties) _nfo.profileProperties = profileProperties;
    }

    return _nfo;
};

var buildPost = function(options) {
    var params = {
        profile: options.profile || {},
        loadConfig: options.loadConfig
    };
    if (params.loadConfig == 'soft'){
        console.log('> soft loaded config with profileInfo:'+params.profile.name);
    } else if (params.loadConfig) {
        console.log('> loaded config with profileInfo:'+params.profile.name);
    }
    // console.log(params.profile);

    var _nfo = {
        profileInfo: {
            avatar: params.profile.avatar,
            last_modified: params.profile.last_modified,
            name: params.profile.name,
            username: params.profile.username
        }
    };

    var profileConfig = (params.profile.profileConfig) ? params.profile.profileConfig : makeParent(params.profile.fetchedProfile, {});
    var postConfig = (params.profile.postConfig) ? params.profile.postConfig : makeParent(params.profile.fetchedProfile, {});
    var profileProperties = (params.profile.profileProperties) ? params.profile.profileProperties : false;

    if (params.loadConfig == 'soft'){
        _nfo.profileConfig = (params.profile.profileConfig) ? true : false;
        _nfo.postConfig = (params.profile.postConfig) ? true : false;
    } else {

        _nfo.profileConfig = profileConfig;
        var _deletingKeys = Object.keys(_nfo.profileInfo);
        for (var i = 0; i < _deletingKeys.length; i++) {
            delete _nfo.profileConfig[_deletingKeys[i]];
        };
        delete _nfo.profileConfig['_id'];


        _nfo.postConfig = postConfig;
        if (profileProperties) _nfo.profileProperties = profileProperties;
    }

    return _nfo;
};


Object.prototype.foo = function() {
    console.log('fooooo');
}
