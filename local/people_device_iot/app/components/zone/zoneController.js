"use strict";
app.controller('zoneCtrl', ['$scope', '$interval', '$http', 'ConfigService', '$state', function($scope, $interval, $http, ConfigService, $state) {
    var host = ConfigService.host;
    var locationId = $state.params.locationId;
    var locationName = $state.params.locationName;
    $scope.locationName = locationName;
    $http.get(host + '/api/zone/getZoneWithStaffByLocationId/' + locationId).success(function(res) {
        $scope.listZones = res.data;
        if (res.data.length === 0) {
            $scope.isShow = true;
        }
    });

    $scope.deployZone = function(zoneId,zoneName) {
        $state.go('home.deployzonedevice',{zoneId:zoneId});
    }
}]);
