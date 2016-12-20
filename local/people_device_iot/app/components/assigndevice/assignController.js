"use strict";
app.controller('assignDeviceCtrl', ['$scope', 'ConfigService', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder',
    '$state', '$compile', '$timeout', 'Notification',
    function($scope, ConfigService, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, $timeout, Notification) {
        var host = ConfigService.host;
        $scope.host = host;
        var list_device_deploy = [];
        // var zoneId = "0d71d5f0-137e-11e6-9361-91bcf9411721";
        // $scope.zoneId = zoneId;
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
            list_device_deploy = [];
            document.getElementById('canvas_iframe').src = '';
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

        $scope.showZoneImage = function(zoneId) {
            $http.get(host + '/api/zone/getZoneById/' + zoneId).then(function(res) {
                var zone = res.data.data[0];
                var zoneimage = zone.zoneimage;
                var zoneWidth = zone.width;
                var zoneHeight = zone.height;
                var iframe_src = '/app/components/assigndevice/zoneCanvas.html';
                document.getElementById('canvas_iframe').src = iframe_src + "?zoneimage=" + zoneimage + "&zonewidth=" + zoneWidth + "&zoneheight=" + zoneHeight;
            })
            $http.get(host + '/api/device/getTypeDeviceByZoneId/' + zoneId).then(function(res) {
                $scope.list_type = res.data.data;
            });
            list_device_deploy= [];
        }

        $scope.selectDeviceByType = function(typeId) {
            list_device_deploy =[];
            $scope.deviceId = '';
            $scope.list_device = [];
            $http.get(host + '/api/device/getDeviceByTypeId/' + typeId+'/'+$scope.zoneId).then(function(res) {
                var lst_device = res.data.data;
                if (lst_device.length != 0) {
                    for (var i = 0; i < lst_device.length; i++) {
                        if (lst_device[i].isdeploy === 1) {
                            lst_device[i].displayname = lst_device[i].name + ' (Deployed)';
                        } else {
                            lst_device[i].displayname = lst_device[i].name;
                        }
                    }
                    $scope.list_device = lst_device;
                    var iframe_src = '/app/components/assigndevice/zoneCanvas.html';
                    document.getElementById('canvas_iframe').contentWindow.setDevice(res.data.data);
                }
            });
            document.getElementById('canvas_iframe').contentWindow.setSelectedDevice(' ');
        }

        // var selectedDevice = [];
        $scope.selectedDevice = function(deviceId) {
            
            $scope.list_device.map(function(d) {
                if (d.id == deviceId && d.isdeploy == 1) {
                    $scope.isShowRemove = true;
                }
            });
        

            // selectedDevice.push(deviceId);
            document.getElementById('canvas_iframe').contentWindow.setSelectedDevice(deviceId);
        }

        $scope.removeAssignDevice = function(deviceId) {
            var removeDevice = document.getElementById('canvas_iframe').contentWindow.removeSelectDevice();
            if (removeDevice) {
                $scope.list_device.map(function(d) {
                    if (d.id == deviceId) {
                        d.isdeploy = 0;
                    }
                });
            }
            $scope.isShowRemove = false;
        }
        window.setDeployed = function(device) {
            $scope.list_device.map(function(d) {
                if (d.id == device.deviceid) {
                    d.coordinates = device.col + ',' + device.row;
                    d.isdeploy = device.isDeploy;
                }
            });
            for (var i = 0; i < list_device_deploy.length; i++) {
                if (list_device_deploy[i].deviceid === device.deviceid) {
                    list_device_deploy.splice(i, 1);
                }
            }
            $scope.$apply($scope.list_device);
            list_device_deploy.push(device);
            if (list_device_deploy.length != 0) {
                $scope.isShowRemove = true;
                $scope.isShowSave = true;
            };
        }

        $scope.saveAssignDevice = function() {
            console.log(list_device_deploy);
            var data = {
                "list_device": list_device_deploy,
                "locationId": $scope.locationId,
                "zoneId": $scope.zoneId,
                "typeId": $scope.typeId
            }
            if (list_device_deploy.length === 0) {
                $scope.isShowAlert = true;
            } else {
                list_device_deploy = [];
                $http({
                    method: "POST",
                    url: host + '/api/deployzonedevice/deploy',
                    data: data
                }).then(function success(response) {
                    $timeout(function() {
                        Notification({ message: 'Assign device successfull', title: 'Success' });
                    }, 200)
                    list_device_deploy = [];
                    console.log(list_device_deploy);
                    // $state.go('home.admin.devicelist');
                }, function error(response) {
                    $scope.errMessage = true;
                });

            }
        }
    }
])
