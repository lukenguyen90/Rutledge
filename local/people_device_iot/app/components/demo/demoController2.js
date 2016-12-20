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
        $scope.origin = [24.5, 24.5]; // true origin for fuzzy testing

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
                            $scope.devicelist.map(function(dv) {
                                if (dv.type.toLowerCase() != 'origin') return;
                                $scope.origin = dv.coordinates.split(',').map(Number);
                            })
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

            $scope.gooo = function(data) {
                $state.go('home.admin.staff.detail', { staffId: data });
            }


            var socket = io();

            var redRoomId = '793c7bb0-a581-11e6-bc01-eb0fef8d55c3';
            var neuRoomId = '88852450-a581-11e6-bc01-eb0fef8d55c3';
            var musRoomId = 'a6f11340-a581-11e6-bc01-eb0fef8d55c3';

            var redzone = [];
            var neutralzone = [];
            var musterzone = [];
            var red_zone = [];

            if (!Array.prototype.remove) {
                Array.prototype.remove = function(val) {
                    var i = this.indexOf(val);
                    return i > -1 ? this.splice(i, 1) : [];
                };
            }
            // console.log(http);
            var fuzzy_border_history = {},
                offset = 0.5;
            var area = [6, 6];
            // 
            var available = function(mobile_id, latest_test) {
                var count = 0
                fuzzy_border_history[mobile_id].map(function(inside) {
                    if (inside) count += 1
                })
                if (fuzzy_border_history[mobile_id].length > 4) {
                    fuzzy_border_history[mobile_id].splice(0, 1)
                }
                fuzzy_border_history[mobile_id].push(latest_test);                
                return count < 3
            }

            socket.on('data', function(msg) {
                if (typeof($scope.zone) != "undefined") {
                    // fuzzy border
                    // var position_test = [msg.position[0] - $scope.origin[0], msg.position[1] - $scope.origin[1]]
                    var position_test = msg.position.map(function(val, idx) {
                        return val - $scope.origin[idx]
                    })

                    function in_fuzzy_border(idx) {
                        return (position_test[idx] < offset) || (position_test[idx] > (area[idx] - offset))
                    }
                    // create a fuzzy_border_history for mobile
                    if (typeof fuzzy_border_history[msg.mobile] == 'undefined') {
                        fuzzy_border_history[msg.mobile] = []
                    }
                    var out_of_box = in_fuzzy_border(0) || in_fuzzy_border(1);
                    //console.log("last 5=", fuzzy_border_history[msg.mobile]);
                    // end section

                    var col = msg.position[0] + 0;
                    var row = msg.position[1] + 0;
                    var available_mobile = available(msg.mobile, out_of_box) || !out_of_box;
                    var mobileItem = {
                        'id': msg.mobile,
                        'col': msg.position[0],
                        'row': msg.position[1],
                        'coordinates': msg.position[0] + ',' + msg.position[1],
                        'type': 'mobile',
                        'name': msg.staff_name,
                        'company': msg.company,
                        'scope': msg.scope,
                        'staffId': msg.staff_id,
                        'room': '',
                        'isDeploy': 1,
                        'show': available_mobile,
                        'time': new Date()
                    };
                    //console.log(position_test,msg.position, "out=" + out_of_box, "show=" + mobileItem.show, mobileItem );
                    $scope.mobiles[msg.mobile] = mobileItem;
                    //check tiemout 10 seconds
                    var dateNow = new Date();
                    for (var k in $scope.mobiles) {
                        if ($scope.mobiles.hasOwnProperty(k)) {
                            var dateItem = new Date(data[k].time);
                            var difference = (dateNow - dateItem) / 1000;
                            //console.log(data[k] + "seconds" +  difference);
                            if(difference>9){
                                document.getElementById("canvas_iframe").contentWindow.deleteMobile(data[k]);
                            }
                        }
                    }
                    document.getElementById("canvas_iframe").contentWindow.setMobile(mobileItem);
                    var totalpob = Object.keys($scope.mobiles).length;
                    $('#totalpob').val(totalpob);
                    //count mobile in red zone
                    var mobile_list = Object.keys($scope.mobiles).map(function(k) {
                        return $scope.mobiles[k]
                    });
                    // var mobile_list = $.makeArray($scope.mobiles);
                    red_zone = $.grep(mobile_list, function(v) {
                        return v.show == true;
                    });
                    $('#missing').val(totalpob - red_zone.length);
                    $('#redzone').val(red_zone.length);

                    //show alert
                    if (available_mobile) {
                        alertDanger('Red Zone.', msg.name);
                    }
                    //show table
                    var tablePob = $('#table-header').html();
                    var tableRedZoon = $('#table-header').html();
                     var tableMissing = $('#table-header').html();
                    var tableRow = $('#table-item').html();
                    for (var k in $scope.mobiles) {
                        if ($scope.mobiles.hasOwnProperty(k)) {
                            var tableItemPob = tableRow;
                            tableItemPob = tableItemPob.replace("NAME", $scope.mobiles[k].name);
                            tableItemPob = tableItemPob.replace("COMPANY", $scope.mobiles[k].company);
                            tableItemPob = tableItemPob.replace("SCOPE", $scope.mobiles[k].scope);
                            tableItemPob = tableItemPob.replace("#", '#/admin/staff/detail/' + $scope.mobiles[k].staffId);
                            tablePob += tableItemPob;
                            if ($scope.mobiles[k].show == true) {
                                var tableItem = tableRow;
                                tableItem = tableItem.replace("NAME", $scope.mobiles[k].name);
                                tableItem = tableItem.replace("COMPANY", $scope.mobiles[k].company);
                                tableItem = tableItem.replace("SCOPE", $scope.mobiles[k].scope);
                                tableItem = tableItem.replace("#", '#/admin/staff/detail/' + $scope.mobiles[k].staffId);
                                tableRedZoon += tableItem;
                            }
                            else{
                                 var tableItem = tableRow;
                                tableItem = tableItem.replace("NAME", $scope.mobiles[k].name);
                                tableItem = tableItem.replace("COMPANY", $scope.mobiles[k].company);
                                tableItem = tableItem.replace("SCOPE", $scope.mobiles[k].scope);
                                tableItem = tableItem.replace("#", '#/admin/staff/detail/' + $scope.mobiles[k].staffId);
                                tableMissing += tableItem;
                            }
                        }
                    }
                    $('#table-pob').html(tablePob);
                    $('#table-redzone').html(tableRedZoon);
                    $('#table-missing').html(tableMissing);
                }
            });

            function alertDanger(roomName, mobileName) {
                Notification.clearAll();
                var message = "";
                angular.forEach(red_zone, function(key) {
                    message += $scope.mobiles[key.id].name + " was found in " + roomName + '<br>';
                })
            }
        }
    }
])
