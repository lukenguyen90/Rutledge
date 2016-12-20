'use strict';
app.service('userService', function($window) {
    this.isLogin = function() {
        return $window.localStorage.loggedUser == undefined ? false : true;
    };
});

app.service('loginService', ['ConfigService', '$http', '$window', '$state', '$q', function(ConfigService, $http, $window, $state, $q) {
    this.login = function(objUser) {
            var host = ConfigService.host;
            var url = host + "/api/user/login";
            var deferred = $q.defer();
            $http.put(url, objUser)
                .then(function(res) {
                    $window.localStorage.token = res.data.token;
                    deferred.resolve(res.data.data[0]);
                });
            return deferred.promise;
        },
        this.logout = function() {
            $window.localStorage.removeItem('loggedUser');
            $window.localStorage.removeItem('token');
        }
}]);
