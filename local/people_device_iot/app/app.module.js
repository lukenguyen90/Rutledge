var app = angular.module('peopleIotApp', ['ui.router', 'datatables', 'angular-md5','ngFileUpload',
    'ui.bootstrap.datetimepicker','ui-notification']);
app.factory('ConfigService', [function() {
    return {
        host: 'http://'+ location.hostname +':9009'    
    };
}]);

app.factory('Storage',function($log){
   return {
       set: function(key,data){
           return window.localStorage.setItem(key,window.JSON.stringify(data));
       },
       get:function(key){
           return window.JSON.parse(window.localStorage.getItem(key));
       },
       remove: function(key){
           return window.localStorage.removeItem(key);
       }
   }
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $state, $window) {
        if ($window.localStorage.token != undefined) {
            $httpProvider.defaults.headers.common['x-access-token'] = $window.localStorage.token;
        }
        return {
            'response': function(response) {
                //Will only be called for HTTP up to 300
                return response;
            },
            'responseError': function(rejection) {
                if (rejection.status === 403) {
                    $state.go('login');
                }
                return $q.reject(rejection);
            }
        };
    });
}]);
