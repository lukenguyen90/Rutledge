"use strict";
app.controller('demoCtrl', ['$scope', 'ConfigService', '$http', '$filter', 'DTOptionsBuilder',
    'DTColumnBuilder', '$state', '$compile', 'Notification',
    function($scope, ConfigService, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, Notification) {
        var host = ConfigService.host;
        $scope.zoneId = '';
        $scope.locationId = '';
        $scope.devicelist = '';
        $scope.zone;
        $scope.rooms = {};
        $scope.mobiles = {};
        var isCanvasLoaded = false;

        document.getElementById('canvas_iframe').onload = function() {


            $http.get(host + '/api/location/getAllLocation').then(function(res) {
                $scope.list_location = res.data.data;
                if ($scope.list_location.length > 0) {
                    $scope.locationId = $scope.list_location[0].id;
                    $scope.selectZoneByLocation();
                }
            });

            $scope.selectZoneByLocation = function() {
                $http.get(host + '/api/zone/getZoneByLocation/' + $scope.locationId).then(function(res) {
                    $scope.list_zone = res.data.data;
                    if ($scope.list_zone.length > 0) {
                        $scope.zoneId = $scope.list_zone[0].id;
                    } else {
                        $scope.zoneId = '';
                    }
                    $scope.selectZone();
                })
            }

            $scope.selectZone = function() {
                $scope.zone = undefined;
                if ($scope.zoneId != '') {
                    $http.get(host + "/api/zone/getZoneById/" + $scope.zoneId)
                        .success(function(res) {
                            if (res.data.length > 0) {
                                $scope.zone = res.data[0];
                                $scope.zone.room_coordinates = JSON.parse($scope.zone.room_coordinates);
                                document.getElementById("canvas_iframe").contentWindow.setZoneInfo($scope.zone);
                            }
                        });
                    $http.get(host + "/api/device/getDeployDeviceByZoneId/" + $scope.zoneId)
                        .success(function(res) {
                            $scope.devicelist = res.data;
                            document.getElementById("canvas_iframe").contentWindow.setDevice(res.data);
                        });
                    $http.get(host + "/api/room/getRoomsByZoneId/" + $scope.zoneId)
                        .success(function(res) {
                            res.data.map(function(r) {
                                $scope.rooms[r.id] = r;
                            })
                        });
                } else {
                    document.getElementById("canvas_iframe").contentWindow.setZoneInfo($scope.zone);
                }
            }

            $scope.zoomOut = function() {
                document.getElementById("canvas_iframe").contentWindow.resetSizeCanvas(-1);
            }

            $scope.zoomIn = function() {
                document.getElementById("canvas_iframe").contentWindow.resetSizeCanvas(1);
            }

            var socket = io();
            var redRoomId = 'e284dslf-1d64-11e6-934d-4342c0e5bbfe';

            socket.on('data', function(msg) {
                if (typeof($scope.zone) != "undefined") {

                    var col = msg.position[0];
                    var row = msg.position[1];
                    console.log( msg.mobile + "("+col + "-" + row + ")");

                    if (col < 0 || row < 0 || col >= $scope.zone.width || row >= $scope.zone.height) {
                        document.getElementById("canvas_iframe").contentWindow.deleteMobile(msg.mobile);
                        if (typeof($scope.mobiles[msg.mobile]) != "undefined") {
                            oldroomid = $scope.mobiles[msg.mobile].room;
                            if (typeof($scope.rooms[oldroomid]) != "undefined") {
                                console.log(msg.name + " move out room " + $scope.rooms[oldroomid].name);
                            } else {
                                console.log(msg.name + " moving out zone ");
                            }
                        } else {
                            console.log(msg.name + " moving out zone ");
                        }
                    } else {
                        var roomid = $scope.zone.room_coordinates[parseInt(col)][parseInt(row)];
                        var oldroomid = '';
                        if (typeof($scope.mobiles[msg.mobile]) != "undefined") {
                            oldroomid = $scope.mobiles[msg.mobile].room;
                        }
                        var mobileItem = {
                            'id': msg.mobile,
                            'col': msg.position[0],
                            'row': msg.position[1],
                            'coordinates': msg.position[0] + ',' + msg.position[1],
                            'type': 'mobile',
                            'name': msg.name,
                            'room': roomid,
                            'isDeploy': 1
                        };
                        $scope.mobiles[msg.mobile] = mobileItem;
                        document.getElementById("canvas_iframe").contentWindow.setMobile(mobileItem);
                        // show alert 
                        if (typeof($scope.mobiles[msg.mobile]) != "undefined") {
                            if (typeof($scope.rooms[roomid]) != "undefined") {
                                var logText = oldroomid != roomid ? " join room " : " move in room ";
                                console.log(msg.name + logText + $scope.rooms[roomid].name);
                                if (roomid == redRoomId && oldroomid != roomid) {
                                    alertDanger($scope.rooms[roomid].name,mobileItem.name);
                                }

                            }
                        }

                    }

                }
            });

            function alertDanger(roomName, mobileName) {
                Notification({ message: mobileName.toUpperCase() + " don't have permission on room : " + roomName, title: 'Danger' }, 'warning');
            }

        }
    }
])
