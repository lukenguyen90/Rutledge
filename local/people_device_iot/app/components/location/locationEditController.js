"use strict";
app.controller('locationEditCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', '$timeout', 'ConfigService',
    'loginService', 'Upload', 'Notification',
    function($scope, $rootScope, $window, $state, $http, $timeout, ConfigService, loginService, Upload, Notification) {
        var host = ConfigService.host;
        var locationId = $state.params.locationId;

        $scope.getLocationInfo = function() {
            $http.get(host + '/api/location/getLocationById/' + locationId).then(function(response) {
                var locationInfo = response.data.data[0];
                $scope.name = locationInfo.name;
                $scope.description = locationInfo.description;
                $scope.picFile = locationInfo.imagelocation;
                $scope.status = locationInfo.active;
            });
        }

        $scope.editLocationInfo = function(file) {
            var dataLocation = {};
            dataLocation.name = $scope.name;
            dataLocation.description = $scope.description;
            dataLocation.active = $scope.status;
            dataLocation.datemodified = new Date();

            if (typeof(file) != 'string' && file != null) {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { file: file },
                });

                file.upload.then(function(response) {
                    dataLocation.imageLocation = '/' + response.data.file.path;
                    updateLocation(locationId, dataLocation);
                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = response.status + ': ' + response.data;
                }, function(evt) {});
            } else {
                dataLocation.imageLocation = $scope.picFile;
                updateLocation(locationId, dataLocation);
                $timeout(function() {

                })
            }
        }

        function updateLocation(locationId, dataLocation) {
            $http({
                method: "POST",
                url: host + '/api/location/updateLocation/' + locationId,
                data: dataLocation
            }).then(function success(response) {
                $timeout(function() {
                    Notification({ message: 'Edit location successfull', title: 'Success' });
                })
                $state.go('home.admin.location');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }
    }
]);
