"use strict";
app.controller('locationCtrl', ['$scope', '$interval', '$http', 'ConfigService','$state', function($scope, $interval, $http,ConfigService,$state) {
    var host = ConfigService.host;
    $http.get(host+'/api/location/getLocationWithStaffNumber').then(function success(response) {
        $scope.allLocations = response.data.data;
    }, function error(response) {
        $scope.allLocations='';
    });

    $scope.changeLocation = function(locationId,locationName) {
        $state.go('home.location.zone', { locationId: locationId,locationName:locationName});
    }
}]);
