"use strict";
app.controller('locationNewCtrl', ['$scope', '$http', 'ConfigService', 'Upload', '$state', '$timeout', 'Notification',
    function($scope, $http, ConfigService, Upload, $state, $timeout, Notification) {
        var host = ConfigService.host;
        $scope.status = 1;

        $scope.saveLocationInfo = function(file) {
            var dataLocation = {};
            dataLocation.name = $scope.name;
            dataLocation.description = $scope.description;
            dataLocation.status = $scope.status;
            dataLocation.datecreated = new Date();

            if (typeof(file) != 'undefined') {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { file: file },
                });

                file.upload.then(function(response) {
                    dataLocation.imageLocation = '/' + response.data.file.path;
                    saveLocation(dataLocation);

                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = true;
                }, function(evt) {});
            } else {
                saveLocation(dataLocation);
            }
        }

        function saveLocation(dataLocation) {
            $http({
                method: "POST",
                url: host + '/api/location/addLocation',
                data: dataLocation
            }).then(function success(response) {
                $timeout(function() {
                    Notification({ message: 'Add location successfull', title: 'Success' });
                },200)
                $state.go('home.admin.location');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }
    }
]);
