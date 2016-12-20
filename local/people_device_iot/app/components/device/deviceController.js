"use strict";
app.controller('deviceCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', '$state',
    '$compile', 'ConfigService', 'Upload', 'Notification', '$timeout',

    function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, ConfigService, Upload,
        Notification, $timeout) {
        var host = ConfigService.host;

        $http.get(host + '/api/device/getAllTypeDevice').then(function(response) {
            $scope.listTypeDevice = response.data.data;
        })

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/device/getAllDevice').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('initComplete', function() {
                $('#btnSearch').on('click', function() {
                    $scope.dtInstance.DataTable.search($('#search').val()).draw();
                })
            })
            .withOption('bLengthChange', false);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('name').withTitle('Device Name'),
            DTColumnBuilder.newColumn('typename').withTitle('Type'),
            DTColumnBuilder.newColumn('ipv6').withTitle('IPv6'),
            DTColumnBuilder.newColumn('statusname').withTitle('Status'),
            DTColumnBuilder.newColumn('active').withTitle('Is Active').renderWith(renderActive),
            // DTColumnBuilder.newColumn('coordinates').withTitle('Coordinates'),
            DTColumnBuilder.newColumn('expireddates').withTitle('Expired date').renderWith(renderDate),
            DTColumnBuilder.newColumn('datecreated').withTitle('Time').renderWith(renderDate),
            DTColumnBuilder.newColumn('id').renderWith(getOption)
        ];

        $scope.dtInstance = {};

        function renderActive(data) {
            if (data === 1) {
                return '<p class="label label-primary">Active</p>';
            } else {
                return '<p class="label label-danger">In Active</p>';
            }
        }

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOption(data, type, full, meta) {
            return '<p class="seemore" ng-click="seeMore(\'' + data + '\')">See More</p>';
        }

        $scope.seeMore = function(data) {
            $state.go('home.device.detail', { deviceId: data });
        }

        $scope.filterByTypeDevice = function() {
            var typeDevice = $scope.typeDevice;
            if (typeDevice != null && typeDevice != '') {
                $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/device/getDeviceByType/' + typeDevice).withDataProp('data')
                    .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                    .withOption('bLengthChange', false);
                $scope.dtInstance.reloadData();
            }
        }
    }

])

app.controller('deviceDetailCtrl', ['$scope', '$http', '$state', 'ConfigService',
    function($scope, $http, $state, ConfigService) {
        var host = ConfigService.host;
        var deviceId = $state.params.deviceId;
        $http.get(host + '/api/device/getDeviceById/' + deviceId).then(function success(response) {
            $scope.deviceDetail = response.data.data[0];
            $scope.status = response.data.data[0].active;
            $scope.description = response.data.data[0].description;
            $scope.status_device = response.data.data[0].status_device;
        }, function error(response) {
            alert("Can't get device information");
        });
    }
])

app.controller('deviceNewCtrl', ['$scope', '$http', '$state', 'ConfigService', 'Upload', 'Notification', '$timeout',
    function($scope, $http, $state, ConfigService, Upload, Notification, $timeout) {

        var host = ConfigService.host;
        $scope.status = 1;
        $http.get(host + '/api/device/getAllTypeDevice').then(function(response) {
            $scope.listTypeDevice = response.data.data;
        })

        $http.get(host + '/api/user/getAllUser').then(function(response) {
            $scope.listUser = response.data.data;
        });

        $scope.createInfoDevice = function(file) {
            var expireddates = new Date($scope.data.dateDropDownInput);
            expireddates.toISOString();
            if (file === undefined) {
                $scope.emptyMessage = true;
            } else {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { file: file },
                });

                file.upload.then(function(response) {
                    var dataDevice = {};
                    dataDevice.chipid = $scope.chipid;
                    dataDevice.name = $scope.name;
                    dataDevice.type = $scope.type;
                    dataDevice.ipv6 = $scope.ipv6;
                    dataDevice.description = $scope.description;
                    dataDevice.imageDevice = '/' + response.data.file.path
                    dataDevice.status = $scope.status;
                    // dataDevice.coordinates = $scope.coordinates;
                    dataDevice.expireddates = expireddates;
                    dataDevice.datecreated = new Date();
                    $http({
                        method: "POST",
                        url: host + '/api/device/createInfoDevice',
                        data: dataDevice
                    }).then(function success(response) {
                        $timeout(function() {
                            Notification({ message: 'Add device successfull', title: 'Success' });

                        }, 200)
                        $state.go('home.admin.devicelist');
                    }, function error(response) {
                        $scope.errMessage = true;
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = response.status + ': ' + response.data;
                }, function(evt) {});
            }

        }
    }
])

app.controller('deviceEditCtrl', ['$scope', '$http', '$state', 'ConfigService', 'Upload', 'Notification', '$timeout',
    function($scope, $http, $state, ConfigService, Upload, Notification, $timeout) {
        var host = ConfigService.host;
        var deviceId = $state.params.deviceId;
        $scope.status = 1;
        $http.get(host + '/api/device/getAllTypeDevice')
            .then(function success(response) {
                $scope.listTypeDevice = response.data.data;
                $http.get(host + '/api/device/getDeviceById/' + deviceId)
                    .then(function success(response) {
                        var data = response.data.data;
                        if (data.length > 0) {
                            $scope.chipid = data[0].chipid;
                            $scope.name = data[0].name;
                            $scope.description = data[0].description;
                            $scope.picFile = data[0].imageDevice;
                            $scope.ipv6 = data[0].ipv6;
                            // $scope.coordinates = data[0].coordinates;
                            var expireddates = new Date(data[0].expireddates);
                            $scope.expireddates = expireddates.toLocaleDateString();
                            $scope.status = data[0].active;
                            $scope.type = data[0].typeid;
                        }
                    }, function error(response) {});
            }, function error(response) {});

        $scope.editDevice = function(file) {
            if (typeof(file) != 'string' && file != null) {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { file: file },
                });

                file.upload.then(function(response) {
                    var dataDeviceUpdate = {};
                    dataDeviceUpdate.id = deviceId;
                    dataDeviceUpdate.chipid = $scope.chipid;
                    dataDeviceUpdate.name = $scope.name;
                    dataDeviceUpdate.description = $scope.description;
                    dataDeviceUpdate.imageDevice = '/' + response.data.file.path;
                    dataDeviceUpdate.type = $scope.type;
                    dataDeviceUpdate.ipv6 = $scope.ipv6;
                    // dataDeviceUpdate.coordinates = $scope.coordinates;
                    var expireddates = new Date($scope.expireddates);
                    dataDeviceUpdate.expireddates = expireddates.toISOString();
                    dataDeviceUpdate.status = $scope.status;
                    dataDeviceUpdate.datemodified = new Date();

                    $http({
                        method: "POST",
                        url: host + '/api/device/updateDevice',
                        data: dataDeviceUpdate
                    }).then(function success(response) {
                        $timeout(function() {
                            Notification({ message: 'Edit device successfull', title: 'Success' });
                        }, 200)
                        $state.go('home.admin.devicelist');
                    }, function error(response) {
                        $scope.errMessage = true;
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = response.status + ': ' + response.data;
                }, function(evt) {});
            } else {
                var dataDeviceUpdate = {};
                dataDeviceUpdate.id = deviceId;
                dataDeviceUpdate.chipid = $scope.chipid;
                dataDeviceUpdate.name = $scope.name;
                dataDeviceUpdate.description = $scope.description;
                dataDeviceUpdate.imageDevice = $scope.picFile;
                dataDeviceUpdate.ipv6 = $scope.ipv6;
                dataDeviceUpdate.type = $scope.type;
                // dataDeviceUpdate.coordinates = $scope.coordinates;
                var expireddates = new Date($scope.expireddates);
                dataDeviceUpdate.expireddates = expireddates.toISOString();
                dataDeviceUpdate.expireddates = expireddates;
                dataDeviceUpdate.status = $scope.status;
                dataDeviceUpdate.datemodified = new Date();
                $http({
                    method: "POST",
                    url: host + '/api/device/updateDevice',
                    data: dataDeviceUpdate
                }).then(function success(response) {
                    $timeout(function() {
                        Notification({ message: 'Edit device successfull', title: 'Success' });
                    }, 200)
                    $state.go('home.admin.devicelist');
                }, function error(response) {
                    $scope.errMessage = true;
                });
            }
        }
    }
])

app.controller('adminLstDeviceCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', '$state', '$compile', 'ConfigService', 'Upload',
    function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, ConfigService, Upload) {
        var host = ConfigService.host;

        $http.get(host + '/api/device/getAllTypeDevice').then(function(response) {
            $scope.listTypeDevice = response.data.data;
        })

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/device/getAllDevice').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('initComplete', function() {
                $('#btnSearch').on('click', function() {
                    $scope.dtInstance.DataTable.search($('#search').val()).draw();
                })
            })
            .withOption('bLengthChange', false);

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('chipid').withTitle('Chip ID'),
            DTColumnBuilder.newColumn('name').withTitle('Device Name'),
            DTColumnBuilder.newColumn('typename').withTitle('Type'),
            DTColumnBuilder.newColumn('ipv6').withTitle('IPv6'),
            DTColumnBuilder.newColumn('statusname').withTitle('Status'),
            DTColumnBuilder.newColumn('active').withTitle('Is Active').renderWith(renderActive),
            // DTColumnBuilder.newColumn('coordinates').withTitle('Coordinates'),
            DTColumnBuilder.newColumn('expireddates').withTitle('Expired date').renderWith(renderDate),
            DTColumnBuilder.newColumn('datecreated').withTitle('Time').renderWith(renderDate),
            DTColumnBuilder.newColumn('id').renderWith(getOption)
        ];

        $scope.dtInstance = {};

        function renderActive(data) {
            if (data === 1) {
                return '<p class="label label-primary">Active</p>';
            } else {
                return '<p class="label label-danger">In Active</p>';
            }
        }

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOption(data, type, full, meta) {
            return '<p class="seemore" ng-click="editDevice(\'' + data + '\')">Edit</p>'+
            '<p class="seemore" data-toggle="modal" data-target="#askDelete" ng-click="delete(\'' + data + '\')">Delete</p>';
        }

        $scope.editDevice = function(data) {
            $state.go('home.admin.deviceedit', { deviceId: data });
        }

        $scope.delete = function(id) {
            $scope.deleteWithAsk = function() {
                var deviceData = {};
                deviceData.deviceid = id;
                $http({
                    method: "POST",
                    url: host + '/api/device/deleteDevice',
                    data: deviceData
                }).then(function success(response) {
                    $scope.dtInstance.reloadData();
                    // $state.go('home.device.typedevice');
                }, function error(response) {
                    $scope.deleteMessage = true;
                });
            }
        }

        $scope.filterByTypeDevice = function() {
            var typeDevice = $scope.typeDevice;
            if (typeDevice != null && typeDevice != '') {
                $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/device/getDeviceByType/' + typeDevice).withDataProp('data')
                    .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                    .withOption('bFilter', false)
                    .withOption('bLengthChange', false);
                $scope.dtInstance.reloadData();
            }
        }

        $scope.addDevice = function() {
            $state.go('home.admin.deviceadd');
        }
    }

])
