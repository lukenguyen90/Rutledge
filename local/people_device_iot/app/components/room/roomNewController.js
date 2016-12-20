
"use strict";
app.controller('roomNewCtrl', ['$scope', 'ConfigService', '$http', '$filter', 'DTOptionsBuilder',
    'DTColumnBuilder', '$state', '$compile',
    function($scope, ConfigService, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile) {
        var host = ConfigService.host;
        $scope.zoneId       = '';
        $scope.locationId   = '';
        $scope.devicelist   = '';
        $scope.zone;

        $http.get(host + '/api/location/getAllLocation').then(function(res) {
            $scope.list_location = res.data.data;
            if( $scope.list_location.length > 0 ){
                $scope.locationId = $scope.list_location[0].id;
                $scope.selectZoneByLocation();
            }
        });

        $scope.selectZoneByLocation = function() {
            $http.get(host + '/api/zone/getZoneByLocation/' + $scope.locationId).then(function(res) {
                $scope.list_zone = res.data.data;
                if( $scope.list_zone.length > 0){
                    $scope.zoneId = $scope.list_zone[0].id;
                }else{
                    $scope.zoneId = '';
                }
                $scope.selectZone();
            })
            document.getElementById("canvas_iframe").contentWindow.changeLocation();
        }

        $scope.selectZone = function(){
            $scope.zone = undefined;
            if($scope.zoneId != ''){
                $http.get(host + "/api/zone/getZoneById/" + $scope.zoneId)
                .success(function(res) {
                    if( res.data.length > 0 ){
                        $scope.zone = res.data[0];
                        document.getElementById("canvas_iframe").contentWindow.setZoneInfo($scope.zone);
                    }
                });
                $http.get(host + "/api/deployzonedevice/getDeviceDeployment/" + $scope.zoneId)
                    .success(function(res) {
                        $scope.devicelist = res.data;
                        document.getElementById("canvas_iframe").contentWindow.setDevice(res.data);
                    });
            }else{
                document.getElementById("canvas_iframe").contentWindow.setZoneInfo($scope.zone);
            }
        }

        $scope.zoomOut = function() {
            document.getElementById("canvas_iframe").contentWindow.resetSizeCanvas(-1);
        }

        $scope.zoomIn = function() {
            document.getElementById("canvas_iframe").contentWindow.resetSizeCanvas(1);
        }

        $scope.saveRoomInfo = function(file) {
            var dataRoom = {};
            dataRoom.name = $scope.name;
            dataRoom.locationid = $scope.locationId;
            dataRoom.zoneid = $scope.zoneId;
            dataRoom.description = $scope.description;
            dataRoom.coordinatex = $scope.coordinatex;
            dataRoom.coordinatey = $scope.coordinatey;
            dataRoom.status = $scope.status;
            dataRoom.datecreated = new Date();

            if (typeof(file) != 'undefined') {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { file: file },
                });

                file.upload.then(function(response) {
                    dataRoom.imageroom = '/' + response.data.file.path;
                    saveRoom(dataRoom);

                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = true;
                }, function(evt) {});
            } else {
                saveRoom(dataRoom);
            }
        }

        $scope.clearNode = function(){
             document.getElementById("canvas_iframe").contentWindow.clearNode();
        }

        function saveRoom(dataRoom) {
            $http({
                method: "POST",
                url: host + '/api/room/addRoom',
                data: dataRoom
            }).then(function success(response) {
                $state.go('home.admin.room');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }

    }
])

