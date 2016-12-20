"use strict";
app.controller('zoneNewCtrl', ['$scope', '$http', '$state', 'ConfigService', 'Upload', '$timeout', 'Notification',
    function($scope, $http, $state, ConfigService, Upload, $timeout, Notification) {
        var host = ConfigService.host;
        $scope.status = 1;

        $http.get(host + '/api/location/getAllLocation').then(function(response) {
            $scope.allLocation = response.data.data;
        })

        $scope.saveZoneInfo = function(file) {
            var dataZone = {};
            dataZone.name = $scope.name;
            dataZone.locationid = $scope.locationId;
            dataZone.description = $scope.description;
            dataZone.width = $scope.width;
            dataZone.height = $scope.height;
            dataZone.status = $scope.status;
            dataZone.datecreated = new Date();

            if (typeof(file) != 'undefined') {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { file: file },
                });

                file.upload.then(function(response) {
                    dataZone.zoneimage = '/' + response.data.file.path;
                    saveZone(dataZone);

                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = true;
                }, function(evt) {});
            } else {
                saveZone(dataZone);
            }
        }

        function saveZone(dataZone) {
            $http({
                method: "POST",
                url: host + '/api/zone/addZone',
                data: dataZone
            }).then(function success(response) {
                $timeout(function() {
                    Notification({ message: 'Add Zone successfull', title: 'Success' });
                }, 200);
                $state.go('home.admin.zone');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }
    }
]);
