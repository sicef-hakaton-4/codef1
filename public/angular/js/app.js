'use strict';
var app = angular.module('app', [
    'ngRoute',
    'ngCookies',
    'ngAnimate'
]);

/**
 * Define routes
 */
app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('sessionInjector');

    $routeProvider.when('/', {
        templateUrl: 'angular/templates/home/home.html',
        controller: 'HomeCtrl',
        css: 'angular/templates/home/home.css'
    })
        .when('/404', {
            templateUrl: 'angular/templates/404/404.html',
            controller: 'NotFoundCtrl',
            css: 'angular/templates/404/404.css'
        })

        .when('/login', {
            templateUrl: 'angular/templates/login/login.html',
            controller: 'LoginCtrl',
            css: 'angular/templates/login/login.css'
        })

        .otherwise({
            redirectTo: '/404'
        });
}]);

//Interceptors
app.factory('sessionInjector', ['$cookies', function($cookies) {
    var sessionInjector = {
        request: function(config) {
            if($cookies.get('token') !== undefined) {
                config.headers['Authorization'] = 'Bearer ' +  $cookies.get('token');
            }
            return config;
        }
    };
    return sessionInjector;
}]);

app.directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
        return {
            restrict: 'E',
            link: function(scope, elem){
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if(current && current.$$route && current.$$route.css){
                        if(!angular.isArray(current.$$route.css)){
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if(next && next.$$route && next.$$route.css){
                        if(!angular.isArray(next.$$route.css)){
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
]);