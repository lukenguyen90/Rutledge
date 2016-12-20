"use strict";
app.controller('roomDetailCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', '$timeout', 'ConfigService', 'loginService', 'Upload',
    function($scope, $rootScope, $window, $state, $http, $timeout, ConfigService, loginService, Upload) {
        var host = ConfigService.host;
        var roomId = $state.params.roomId;
        //begin
        var canvas = undefined;
        canvas = new fabric.Canvas('canvas', { selection: false });

        var zoneimage;
        //global variables 
        var canvasScale = 1; //global
        var SCALE_FACTOR = 1.25; //global 

        var zoneId = "0d71d5f0-137e-11e6-9361-91bcf9411721";
        $http.get(ConfigService.host + "/api/deployzonedevice/getZoneImage/" + zoneId).then(
            function(response) {
                zoneimage = response.data.data[0].zoneimage
                loadImages(canvas, zoneimage);
            });

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
        $scope.getZoneInfo = function() {
            $http.get(host + '/api/room/getRoomWithZoneById/' + roomId).then(function(response) {
                var roomInfo = response.data.data[0];
                $scope.name = roomInfo.name;
                $scope.description = roomInfo.description;
                $scope.locationId = roomInfo.locationname;
                $scope.zoneId = roomInfo.zonename;
                $scope.coordinatex = roomInfo.coordinatex;
                $scope.coordinatey = roomInfo.coordinatey;
                $scope.picFile = roomInfo.imageroom;
                $scope.datecreated = new Date(roomInfo.datecreated).toDateString();
                $scope.datemodified = new Date(roomInfo.datemodified).toDateString();
                $scope.status = roomInfo.active;
            });
        }
    }
]);
