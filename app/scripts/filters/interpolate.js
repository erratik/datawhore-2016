define(['./module'], function (filters) {
    'use strict';

    return filters
        .filter('interpolate', ['version', function (version) {
            return function (text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            }
        }])
        .filter('typeof', function () {
            return function (context) {
                return typeof context;
            }
        })
        .filter('length', function () {
            return function (context) {
                // //console.log(context.length);
                return (typeof context == "object") ? Object.keys(context).length : '';
            }
        })
        .filter('fromNow', function () {
            return function (date) {
                return moment.unix(date).fromNow();
            }
        })
        .filter('orderObjectBy', function () {
            return function (input, attribute) {
                if (!angular.isObject(input)) return input;

                var array = [];
                for (var objectKey in input) {
                    array.push(input[objectKey]);
                }

                array.sort(function (a, b) {
                    a = parseInt(a[attribute]);
                    b = parseInt(b[attribute]);
                    return a - b;
                });
                return array;
            }
        });

});
