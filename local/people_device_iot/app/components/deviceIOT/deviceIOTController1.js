"use strict";
app.controller('deviceIOTCtrl', ['$scope', 'ConfigService', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', '$state', '$compile',
    function($scope, ConfigService, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile) {
        var host = ConfigService.host;
        $scope.host = host;
        var zoneId = "0d71d5f0-137e-11e6-9361-91bcf9411721";
        $scope.zoneId = zoneId;
        $scope.devicelist = '';
        $scope.select_device_type = 'server';
        $scope.filter = { 'type': 'server', 'id': '' };


        $http.get(host + '/api/location/getAllLocation').then(function(res) {
            $scope.list_location = res.data.data;
        });

        $scope.selectZoneByLocation = function(locationId) {
            $http.get(host + '/api/zone/getZoneByLocation/' + locationId).then(function(res) {
                $scope.list_zone = res.data.data;
            })
        }

        $scope.selectZone = function(zoneId) {
            console.log(zoneId);
        }





        $scope.change_filter_type = function() {
            $scope.filter['type'] = $scope.select_device_type;
            $scope.filter['id'] = '';
            document.getElementById("canvas_iframe").contentWindow.setFilter($scope.filter);
        }

        $scope.zoomOut = function() {
            document.getElementById("canvas_iframe").contentWindow.resetSizeCanvas(-1);
        }

        $scope.zoomIn = function() {
            document.getElementById("canvas_iframe").contentWindow.resetSizeCanvas(1);
        }

        var socket = io();
        var x = undefined;
        var y = undefined;
        var id = undefined;
        // socket.on('data', function(msg) {
        //     document.getElementById("canvas_iframe").contentWindow.setMobile(msg);
        // });

        document.getElementById('canvas_iframe').onload = function() {
            $http.get(host + "/api/deployzonedevice/getDeviceDeployment/" + zoneId)
                .success(function(res) {
                    $scope.devicelist = res.data;
                    document.getElementById("canvas_iframe").contentWindow.setDevice(res.data);
                });
            socket.on('data', function(msg) {
                document.getElementById("canvas_iframe").contentWindow.setMobile(msg);
            });
        };


    }
])
