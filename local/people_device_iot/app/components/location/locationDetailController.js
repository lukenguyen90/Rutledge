"use strict";
app.controller('locationDetailCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', '$timeout', 'ConfigService', 'loginService', 'Upload',
    function($scope, $rootScope, $window, $state, $http, $timeout, ConfigService, loginService, Upload) {
        var host = ConfigService.host;
        var locationId = $state.params.locationId;

        $scope.getLocationInfo = function() {
            $http.get(host + '/api/location/getLocationById/' + locationId).then(function(response) {
                var locationInfo = response.data.data[0];
                $scope.name = locationInfo.name;
                $scope.description = locationInfo.description;
                $scope.picFile = locationInfo.imagelocation;
                $scope.status = locationInfo.active;
                $scope.datecreated = new Date(locationInfo.datecreated).toDateString();
                $scope.datemodified = new Date(locationInfo.datemodified).toDateString();
            });
        }
    }
]);
