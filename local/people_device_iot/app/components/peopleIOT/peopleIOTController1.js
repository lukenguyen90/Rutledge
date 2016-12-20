"use strict";
app.controller('peopleIOTCtrl', ['$scope', 'ConfigService', '$http', '$filter', 'DTOptionsBuilder',
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

        // $scope.hoverInCanvas = function(){
        //     document.getElementById("canvas_iframe").contentWindow.activeMousePosition(true);
        // }

        // $scope.outCanvas = function(){
        //     document.getElementById("canvas_iframe").contentWindow.activeMousePosition(false);
        // }

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

        socket.on('data', function(msg) {
            var mobileItem = {
                'id'        : msg.mobile,
                'col'       : msg.position[0],
                'row'       : msg.position[1],
                'coordinates':msg.position[0]+','+msg.position[1],
                'type'      : 'mobile',
                'name'      : msg.name,
                'isDeploy'  : 1
            };
            document.getElementById("canvas_iframe").contentWindow.setMobile(mobileItem);
        });


    }
])
