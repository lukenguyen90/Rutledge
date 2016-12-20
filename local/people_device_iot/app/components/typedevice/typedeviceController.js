"use strict";
app.controller('typedeviceCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder',
    '$state', '$compile', 'ConfigService', 'Upload',
    function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, ConfigService, Upload) {
        var host = ConfigService.host;

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/device/getAllTypeDevice').withDataProp('data')
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
            // DTColumnBuilder.newColumn('name').withTitle('Name'),
            DTColumnBuilder.newColumn('title').withTitle('Title'),
            DTColumnBuilder.newColumn('description').withTitle('Description'),
            DTColumnBuilder.newColumn('datecreated').withTitle('Date created').renderWith(renderDate),
            DTColumnBuilder.newColumn('id').renderWith(getOption)
        ];

        $scope.dtInstance = {};

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOption(data, type, full, meta) {
            return '<p class="seemore" ng-click="edit(\'' + data + '\')">Edit</p>'+
            '<p class="seemore" data-toggle="modal" data-target="#askDelete" ng-click="delete(\'' + data + '\')">Delete</p>';
        }

        $scope.edit = function(id) {
            $state.go('home.admin.typedevice.edit', { typeid: id });
        }

        $scope.delete = function(id) {
            $scope.deleteWithAsk = function() {
                var typeDeviceData = {};
                typeDeviceData.typeid = id;
                $http({
                    method: "POST",
                    url: host + '/api/device/deleteTypeDevice',
                    data: typeDeviceData
                }).then(function success(response) {
                    $scope.dtInstance.reloadData();
                    $state.go('home.device.typedevice');
                }, function error(response) {
                    $scope.deleteMessage = true;
                });
            }
        }

        $scope.addType = function(){
            $state.go('home.admin.typedevice.new');
        }
    }
])

app.controller('createTypeDeviceCtrl', ['$scope', '$http', '$state', 'ConfigService', '$timeout', 'Notification',
    function($scope, $http, $state, ConfigService, $timeout, Notification) {
        var host = ConfigService.host;

        $scope.createTypeDevice = function() {
            var typeDeviceData = {};
            typeDeviceData.name = $scope.title;
            typeDeviceData.title = $scope.title;
            typeDeviceData.description = $scope.description;
            typeDeviceData.datecreated = new Date();
            $http({
                method: "POST",
                url: host + '/api/device/createTypeDevice',
                data: typeDeviceData
            }).then(function success(response) {
                $timeout(function() {
                    Notification({ message: 'Add type device successfull', title: 'Success' });
                }, 200);
                $state.go('home.admin.typedevice');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }

        $scope.resetInput = function() {
            $scope.name = '';
            $scope.title = '';
            $scope.description = '';
        }
    }
])

app.controller('editTypeDeviceCtrl', ['$scope', '$http', '$state', 'ConfigService', '$timeout', 'Notification',
    function($scope, $http, $state, ConfigService, $timeout, Notification) {
        var host = ConfigService.host;
        var typeid = $state.params.typeid;
        $http.get(host + '/api/device/getTypeDeviceById/' + typeid).then(function(response) {
            $scope.name = response.data.data[0].title;
            $scope.title = response.data.data[0].title;
            $scope.description = response.data.data[0].description;
        })

        $scope.updateTypeDevice = function() {
            var typeDeviceData = {};
            typeDeviceData.name = $scope.title;
            typeDeviceData.title = $scope.title;
            typeDeviceData.description = $scope.description;
            typeDeviceData.datemodified = new Date();
            $http({
                method: "POST",
                url: host + '/api/device/updateTypeDevice/' + typeid,
                data: typeDeviceData
            }).then(function success(response) {
                $timeout(function() {
                    Notification({ message: 'Update type device successfull', title: 'Success' });
                }, 200);
                $state.go('home.admin.typedevice');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }

        $scope.resetInput = function() {
            $scope.name = '';
            $scope.title = '';
            $scope.description = '';
        }
    }
]);

app.controller('detailTypeDeviceCtrl', ['$scope', '$http', '$state', 'ConfigService',
    function($scope, $http, $state, ConfigService) {
        var host = ConfigService.host;
        var typeid = $state.params.typeid;
        $http.get(host + '/api/device/getTypeDeviceById/' + typeid).then(function(response) {
            $scope.name = response.data.data[0].title;
            $scope.title = response.data.data[0].title;
            $scope.description = response.data.data[0].description;
            $scope.datecreated = new Date(response.data.data[0].datecreated).toUTCString();
            $scope.datemodified = new Date(response.data.data[0].datemodified).toUTCString();
        })
    }
])
