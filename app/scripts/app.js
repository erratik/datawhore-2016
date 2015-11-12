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
          profileData: function(ProfileService, $stateParams) {
            console.log($stateParams);
            return ProfileService.getProfile({namespace: $stateParams.namespace, loadConfig: true});
            // return ProfileService.load($stateParams.namespace);
          },
          postData: function(ProfileService, $stateParams) {
            return ProfileService.getPosts({namespace: $stateParams.namespace, count: 1});
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


var buildProfile = function(profile, loadConfig) {
    
    if (loadConfig == 'soft'){
        console.log('> soft loaded config with profileInfo');
    } else if (loadConfig) {
        console.log('> loaded config with profileInfo');
    }
    var _nfo = {
        profileInfo: {
            avatar: profile.avatar,
            last_modified: profile.last_modified,
            name: profile.name,
            saved: profile.saved,
            username: profile.username
        }
    };

    var profileConfig = (profile.postConfig || profile.profileConfig) ? profile.profileConfig : makeParent(profile, {});
    var postConfig = (profile.postConfig || profile.profileConfig) ? profile.postConfig : makeParent(profile, {});

    if (loadConfig == 'soft'){
        _nfo.profileConfig = (profile.profileConfig) ? true : false;
        _nfo.postConfig = (profile.postConfig) ? true : false;
    } else {

        _nfo.profileConfig = profileConfig;
        _nfo.postConfig = postConfig;
    }

    return _nfo;
};


var enabledProperties = function(props){ 
    console.log(props);
    var obj = {};
    // var propsKeys = Object.keys(props);
    // for (var i = 0; i < propsKeys.length; i++) {
    //     if (typeof props[propsKeys[i]].content.enabled == 'boolean') {

    //     console.log(props[propsKeys[i]].content);
    //     }

    // };

    return obj; 

};