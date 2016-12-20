"use strict";
app.controller('roomEditCtrl', ['$scope', '$state', '$http', 'ConfigService', 'Upload', 'Notification', '$timeout',
    function($scope, $state, $http, ConfigService, Upload, Notification, $timeout) {
        var host = ConfigService.host;
        var roomId = $state.params.roomId;
        var zoneimage;
        $http.get(host + '/api/room/getRoomWithZoneById/' + roomId).then(function(response) {
            var roomInfo = response.data.data[0];
            $scope.name = roomInfo.name;
            $scope.description = roomInfo.description;
            $scope.coordinatex = roomInfo.coordinatex;
            $scope.coordinatey = roomInfo.coordinatey;
            $scope.locationId = roomInfo.locationid;
            $scope.zoneId = roomInfo.zoneid;
            $http.get(ConfigService.host + "/api/deployzonedevice/getZoneImage/" + roomInfo.zoneid).then(
                function(response) {
                    zoneimage = response.data.data[0].zoneimage
                    loadImages(canvas, zoneimage);
                });
            getZone(roomInfo.locationid);
            $scope.picFile = roomInfo.imageroom;
            $scope.status = roomInfo.active;
        });
        //begin

        var canvas = undefined;
        canvas = new fabric.Canvas('canvas', { selection: false });

        //global variables 
        var canvasScale = 1; //global
        var SCALE_FACTOR = 1.25; //global 

        $scope.selectZoneId = function(zoneId) {
            $http.get(ConfigService.host + "/api/deployzonedevice/getZoneImage/" + zoneId).then(
                function(response) {
                    zoneimage = response.data.data[0].zoneimage
                    loadImages(canvas, zoneimage);
                });
        }

        function loadImages(canvas, zoneimage) {
            var img = new Image();
            img.onload = function() {
                var imgWidth = this.width;
                var imgHeight = this.height;
                canvas.setHeight(imgHeight);
                canvas.setWidth(imgWidth);
                canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
                    originX: 'left',
                    originY: 'top',
                    left: 0,
                    top: 0
                });
                var grid = 60;
                // create grid
                for (var i = 0; i < (imgWidth / grid); i++) {
                    var text = new fabric.Text(i + '', {
                        top: i * grid,
                        left: 0,
                        fontSize: 18,
                        borderColor: '#ccc',
                        opacity: 1,
                        fontFamily: "helvetica"
                    }).setOpacity(0.5);
                    var text1 = new fabric.Text(i + '', {
                        top: 0,
                        left: i * grid,
                        fontSize: 18,
                        borderColor: '#ccc',
                        opacity: 1,
                        fontFamily: "helvetica"
                    }).setOpacity(0.5);
                    canvas.add(text);
                    canvas.add(text1);
                    canvas.add(new fabric.Line([i * grid, 0, i * grid, imgHeight], { stroke: '#ccc', selectable: false }));
                    canvas.add(new fabric.Line([0, i * grid, imgWidth, i * grid], { stroke: '#ccc', selectable: false }));
                }
            };
            img.src = zoneimage;
        }

        $scope.zoomOut = function() {
            canvasScale = canvasScale / SCALE_FACTOR;
            canvas.setHeight(canvas.getHeight() * (1 / SCALE_FACTOR));
            canvas.setWidth(canvas.getWidth() * (1 / SCALE_FACTOR));
            var objects = canvas.getObjects();
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;
                var tempScaleX = scaleX * (1 / SCALE_FACTOR);
                var tempScaleY = scaleY * (1 / SCALE_FACTOR);
                var tempLeft = left * (1 / SCALE_FACTOR);
                var tempTop = top * (1 / SCALE_FACTOR);
                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;
                objects[i].setCoords();
            }
            var img = new Image();
            img.onload = function() {
                var imgWidth = this.width;
                var imgHeight = this.height;
                canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
                    originX: 'left',
                    originY: 'top',
                    top: 0,
                    left: 0,
                    scaleY: canvas.height / img.height,
                    scaleX: canvas.width / img.width
                });
            };
            img.src = zoneimage;
            canvas.renderAll();
        }

        $scope.zoomIn = function() {
                canvasScale = canvasScale * SCALE_FACTOR;
                canvas.setHeight(canvas.getHeight() * SCALE_FACTOR);
                canvas.setWidth(canvas.getWidth() * SCALE_FACTOR);
                var objects = canvas.getObjects();
                for (var i in objects) {
                    var scaleX = objects[i].scaleX;
                    var scaleY = objects[i].scaleY;
                    var left = objects[i].left;
                    var top = objects[i].top;
                    var tempScaleX = scaleX * SCALE_FACTOR;
                    var tempScaleY = scaleY * SCALE_FACTOR;
                    var tempLeft = left * SCALE_FACTOR;
                    var tempTop = top * SCALE_FACTOR;
                    objects[i].scaleX = tempScaleX;
                    objects[i].scaleY = tempScaleY;
                    objects[i].left = tempLeft;
                    objects[i].top = tempTop;
                    objects[i].setCoords();
                }
                var img = new Image();
                img.onload = function() {
                    var imgWidth = this.width;
                    var imgHeight = this.height;
                    canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
                        originX: 'left',
                        originY: 'top',
                        top: 0,
                        left: 0,
                        scaleY: canvas.height / img.height,
                        scaleX: canvas.width / img.width
                    });
                };
                img.src = zoneimage;
                canvas.renderAll();
            }
            //end

        $scope.selectZoneByLocation = function(locationId) {
            getZone(locationId);
        }

        function getZone(locationId) {
            $http.get(host + '/api/zone/getZoneByLocation/' + locationId).then(function(response) {
                $scope.allZone = response.data.data;
            })
        }

        $http.get(host + '/api/location/getAllLocation').then(function(response) {
            $scope.allLocation = response.data.data;
        })

        $scope.editRoomInfo = function(file) {
            var dataRoom = {};
            dataRoom.name = $scope.name;
            dataRoom.coordinatex = $scope.coordinatex;
            dataRoom.coordinatey = $scope.coordinatey;
            dataRoom.description = $scope.description;
            dataRoom.active = $scope.status;
            dataRoom.locationId = $scope.locationId;
            dataRoom.zoneId = $scope.zoneId;
            dataRoom.datemodified = new Date();

            if (typeof(file) != 'string' && file != null) {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { file: file },
                });

                file.upload.then(function(response) {
                    dataRoom.imageroom = '/' + response.data.file.path;
                    $timeout(function() {
                        Notification({ message: 'Edit room successfull', title: 'Success' });
                    }, 200)
                    updateRoom(roomId, dataRoom);
                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = response.status + ': ' + response.data;
                }, function(evt) {});
            } else {
                dataRoom.imageroom = $scope.picFile;
                $timeout(function() {
                    Notification({ message: 'Edit room successfull', title: 'Success' });
                }, 200)
                updateRoom(roomId, dataRoom);
            }
        }

        function updateRoom(roomId, dataRoom) {
            $http({
                method: "POST",
                url: host + '/api/room/updateRoom/' + roomId,
                data: dataRoom
            }).then(function success(response) {
                $state.go('home.admin.room');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }
    }
]);
