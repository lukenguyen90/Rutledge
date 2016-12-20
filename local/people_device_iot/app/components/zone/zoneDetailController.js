"use strict";
app.controller('zoneDetailCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', '$timeout', 'ConfigService', 'loginService', 'Upload',
    function($scope, $rootScope, $window, $state, $http, $timeout, ConfigService, loginService, Upload) {
        var host = ConfigService.host;
        var zoneId = $state.params.zoneId;

        $scope.getZoneInfo = function() {
            $http.get(host + '/api/zone/getZoneWithLocationById/' + zoneId).then(function(response) {
                var zoneInfo = response.data.data[0];
                $scope.name = zoneInfo.name;
                $scope.description = zoneInfo.description;
                $scope.locationId = zoneInfo.locationname;
                $scope.picFile = zoneInfo.zoneimage;
                $scope.datecreated = new Date(zoneInfo.datecreated).toDateString();
                $scope.datemodified = new Date(zoneInfo.datemodified).toDateString();
                $scope.status = zoneInfo.active;
            });
        }
    }
]);
