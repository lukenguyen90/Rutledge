"use strict";
app.controller('zoneEditCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', '$timeout',
    'ConfigService', 'loginService', 'Upload', 'Notification',
    function($scope, $rootScope, $window, $state, $http, $timeout, ConfigService, loginService, Upload, Notification) {
        var host = ConfigService.host;
        var zoneId = $state.params.zoneId;

        $scope.getZoneInfo = function() {
            $http.get(host + '/api/zone/getZoneWithLocationById/' + zoneId).then(function(response) {
                var zoneInfo = response.data.data[0];
                $scope.name = zoneInfo.name;
                $scope.description = zoneInfo.description;
                $scope.locationId = zoneInfo.locationid;
                $scope.picFile = zoneInfo.zoneimage;
                $scope.status = zoneInfo.active;
            });
        }

        $http.get(host + '/api/location/getAllLocation').then(function(response) {
            $scope.allLocation = response.data.data;
        })

        $scope.editZoneInfo = function(file) {
            var dataZone = {};
            dataZone.name = $scope.name;
            dataZone.description = $scope.description;
            dataZone.active = $scope.status;
            dataZone.locationId = $scope.locationId;
            dataZone.datemodified = new Date();

            if (typeof(file) != 'string' && file != null) {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { file: file },
                });

                file.upload.then(function(response) {
                    dataZone.zoneimage = '/' + response.data.file.path;
                    updateZone(zoneId, dataZone);
                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = response.status + ': ' + response.data;
                }, function(evt) {});
            } else {
                dataZone.zoneimage = $scope.picFile;
                updateZone(zoneId, dataZone);
            }
        }

        function updateZone(zoneId, dataZone) {
            $http({
                method: "POST",
                url: host + '/api/zone/updateZone/' + zoneId,
                data: dataZone
            }).then(function success(response) {
                $timeout(function() {
                    Notification({ message: 'Update Zone successfull', title: 'Success' });
                }, 200);
                $state.go('home.admin.zone');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }
    }
]);
