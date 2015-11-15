var app = angular.module('app', [
    'ui.router', 
    'angularMoment', 
    'angular.filter',
    'angularify.semantic',

    'controllers.Settings',
    'controllers.Profiles',
    'controllers.Networks',
    // 'services.Settings',
    'services.Settings',
    'services.Profile'

]);

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

// use unix timestamps in angular views
app.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
}).config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('settings', {
        url: '/settings',
        controller: 'settingsController as settings',
        templateUrl: 'templates/tpl--settings.html'
    }).state('profiles', {
        url: '/',
        controller: 'profilesController',
        templateUrl: 'templates/tpl--profiles.html',
        resolve: {
          configs: function(SettingsService) {
            return SettingsService.getNetworkConfigs({namespace: false});
            // return ProfileService.load($stateParams.namespace);
          },
          profiles: function(ProfileService) {
            return ProfileService.getProfile({namespace: false, loadConfig: 'soft'});
            // return ProfileService.load($stateParams.namespace);
          },
        }
    }).state('profile', {
        url: '/profile/:namespace',
        controller: 'profileController',
        templateUrl: 'templates/tpl--profile.html',
        resolve: {
          profile: function(ProfileService, $stateParams) {
            
            return ProfileService.getProfile({namespace: $stateParams.namespace, loadConfig: true});
            // return ProfileService.load($stateParams.namespace);
          },
          config: function(ProfileService, $stateParams) {
            console.log($stateParams);
            return ProfileService.getConfig($stateParams.namespace);
          }
        }
    });
}]);

    

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

    var profileConfig = (params.profile.profileConfig) ? params.profile.profileConfig : makeParent(params.profile, {});
    var postConfig = (params.profile.postConfig) ? params.profile.postConfig : makeParent(params.profile, {});
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
