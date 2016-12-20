"use strict";
app.controller('deviceDeployCtrl', ['$scope', 'ConfigService', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder',
    '$state', '$compile', '$timeout', 'Notification',
    function($scope, ConfigService, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, $timeout, Notification) {
    // get main size
        var viewportHeight;
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        if (typeof window.innerHeight != 'undefined'){
          viewportHeight = window.innerHeight
        }
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined' && 
            typeof document.documentElement.clientHeight != 'undefined' && 
            document.documentElement.clientHeight != 0){
           viewportHeight = document.documentElement.clientHeight
        }else{// older versions of IE
           viewportHeight = document.getElementsByTagName('body')[0].clientHeight
        }
    // get zone infomation
    var loaded = false;
        var host = ConfigService.host;
        $scope.host     = host;
        $scope.typeId   = "";
        $scope.deviceId = "";
        $scope.isShowSelectDevice = false ;
        $scope.isShowUndeploy = false ;

        var $canvas = document.getElementById('canvas_iframe');

        $canvas.style.height = (viewportHeight-50)+"px";

        $scope.undeploy = function() {
            for (var i = 0; i < $scope.list_device.length; i++) {
                if ( $scope.list_device[i].id == $scope.deviceId ) {
                    $scope.isShowUndeploy = false ;
                    $scope.list_device[i].isdeploy = 0 ;
                    $canvas.contentWindow.undeploy($scope.deviceId);
                    $scope.saveDevice($scope.list_device[i]);
                }
            }
        }
        $scope.saveDevice = function(device) {
            device.type = $scope.typeId ;
            $http({
                method: "POST",
                url: host + '/api/device/updateDevice',
                data: device
            }).then(function success(response) {
                $timeout(function() {
                    Notification({ message: 'Update device info successfull', title: 'Success' });
                }, 200)
            }, function error(response) {
                $scope.errMessage = true;
            });
        }

        $http.get(host + '/api/zone/getZoneInfo').then(function(res) {
            $scope.zone = res.data.data;
            var iframe_src = '/app/components/device/deployCanvas.html';
            $canvas.src = iframe_src + "?zoneimage=" + $scope.zone.zoneimage 
            + "&zonewidth=" + $scope.zone.width 
            + "&zoneheight=" + $scope.zone.height;
            
            $http.get(host + '/api/device/getAllTypeDevice').then(function(res) {
                $scope.list_type = res.data.data;
                $scope.isShowUndeploy = false ;
                $scope.selectDeviceByType = function() {
                    $scope.list_device = [];
                    $http.get(host + '/api/device/getDeviceByTypeId/' + $scope.typeId+'/'+$scope.zone.id).then(function(res) {
                        var lst_device = res.data.data;
                        for (var i = 0; i < lst_device.length; i++) {
                            if (lst_device[i].isdeploy === 1 && lst_device[i].id == $scope.deviceId ) {
                                $scope.isShowUndeploy = true ;
                            }
                        }
                        $scope.list_device = lst_device;
                        if(loaded){
                            $canvas.contentWindow.setDevice($scope.list_device);
                            $canvas.contentWindow.setSelectedDevice($scope.deviceId);
                        }
                    });
                    $scope.isShowSelectDevice = $scope.typeId!=="" ;
                }
                $scope.setSelectedDevice = function() {
                    $scope.isShowUndeploy = false ;
                    $canvas.contentWindow.setSelectedDevice($scope.deviceId);
                    for (var i = 0; i < $scope.list_device.length; i++) {
                        if ($scope.list_device[i].isdeploy === 1 && $scope.list_device[i].id == $scope.deviceId ) {
                            $scope.isShowUndeploy = true ;
                        }
                    }
                }
            });
        });


    // disable main scroll when iframe scroll
        (function(w) {
            var s = { insideIframe: false } 

            $($canvas).mouseenter(function() {
                s.insideIframe = true;
                s.scrollX = w.scrollX;
                s.scrollY = w.scrollY;
            }).mouseleave(function() {
                s.insideIframe = false;
            });

            $(document).scroll(function() {
                if (s.insideIframe)
                    w.scrollTo(s.scrollX, s.scrollY);
            });
        })(window);


        window.setFrameLoaded = function(){
            loaded = true;
        }  

        window.deployDevice = function(data){
            for (var i = 0; i < $scope.list_device.length; i++) {
                if ($scope.list_device[i].id == data.deviceid ) {
                    $scope.list_device[i].isdeploy = data.isdeploy;
                    $scope.list_device[i].coordinates = data.coordinates;
                    if(data.isdeploy){
                        $scope.list_device[i].zoneid = $scope.zone.id;
                    }else{
                        $scope.list_device[i].zoneid = null;
                    }
                    $scope.saveDevice($scope.list_device[i]);
                }
            }
        }



    }
])
