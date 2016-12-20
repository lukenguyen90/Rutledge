"use strict";
app.controller('notificationCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', '$state', '$compile', 'ConfigService',
    function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, ConfigService) {
        var host = ConfigService.host;

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/notification/getAllNotification').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('bFilter', false)
            .withOption('bLengthChange', false);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('title').withTitle('Title'),
            DTColumnBuilder.newColumn('message').withTitle('Message'),
            DTColumnBuilder.newColumn('level').withTitle('Level'),
            DTColumnBuilder.newColumn('datecreated').withTitle('Date created').renderWith(renderDate),
            DTColumnBuilder.newColumn('datemodified').withTitle('Date Modified').renderWith(renderDate),
            DTColumnBuilder.newColumn('id').withTitle('Option').renderWith(renderOption)
        ];
        $scope.dtInstance = {};

        function renderOption(data) {
            return '<p class="seemore" ng-click="seeMore(\'' + data + '\')">See More</p>';
        }

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        $scope.seeMore = function(data) {
            $state.go('home.notification.detail', { notificationId: data });
        }
    }
])

app.controller('notificationNewCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', '$state',
    '$compile', 'ConfigService', '$timeout', 'Notification',
    function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, ConfigService, $timeout, Notification) {
        var host = ConfigService.host;

        $scope.saveNotification = function() {
            var notification = {};
            notification.level = $scope.level;
            notification.title = $scope.title;
            notification.message = $scope.message;
            notification.datecreated = new Date();
            $http({
                method: "POST",
                url: host + '/api/notification/new',
                data: notification
            }).then(function success(response) {
                $timeout(function() {
                    Notification({ message: 'Create notification successfull', title: 'Success' });
                }, 200);
                $state.go('home.admin.notification');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }

    }
])

app.controller('notificationManagementCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder',
    '$state', '$compile', 'ConfigService',
    function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, ConfigService) {
        var host = ConfigService.host;
        $scope.addNotification = function() {
            $state.go('home.admin.notification.new');
        }
        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/notification/getAllNotification').withDataProp('data')
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
            DTColumnBuilder.newColumn('title').withTitle('Title'),
            DTColumnBuilder.newColumn('message').withTitle('Message'),
            DTColumnBuilder.newColumn('level').withTitle('Level').renderWith(renderLevel),
            DTColumnBuilder.newColumn('datecreated').withTitle('Date created').renderWith(renderDate),
            DTColumnBuilder.newColumn('datemodified').withTitle('Date Modified').renderWith(renderDate),
            DTColumnBuilder.newColumn('id').withTitle('Action').renderWith(renderOption)
        ];
        $scope.dtInstance = {};

        function renderLevel(data) {
            if (data == 0) {
                return '<p class="label label-primary">High</p>';
            } else if (data == 1) {
                return '<p class="label label-danger">Middle</p>';
            } else {
                return '<p class="label label-warning">Low</p>';
            }
        }

        function renderOption(data) {
            return '<p class="seemore" ng-click="seeMore(\'' + data + '\')">See More</p>' +
                '<p class="seemore" ng-click="edit(\'' + data + '\')">Edit</p>';
        }

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        $scope.seeMore = function(data) {
            $state.go('home.notification.detail', { notificationId: data });
        }

        $scope.edit = function(data) {
            $state.go('home.admin.notification.edit', { notificationId: data });
        }
    }
])

app.controller('notificationDetailCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder',
    '$state', '$compile', 'ConfigService',
    function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, ConfigService) {
        var host = ConfigService.host;
        var notificationId = $state.params.notificationId;

        $http.get(host + '/api/notification/getNotificationById/' + notificationId).then(function(response) {
            var notification = response.data.data[0];
            $scope.title = notification.title;
            $scope.message = notification.message;
            if (notification.level == 0) {
                $scope.level = 'High';
            } else if (notification.level == 1) {
                $scope.level = 'Middle';
            } else {
                $scope.level = 'Low';
            }
            $scope.datecreated = formatDate(notification.datecreated);
            $scope.datemodified = formatDate(notification.datemodified);
        });

        function formatDate(date) {
            var date = new Date(date);
            return date.toLocaleString();
        }
    }
])

app.controller('notificationEditCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder',
    '$state', '$compile', 'ConfigService', '$timeout', 'Notification',
    function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile, ConfigService, $timeout, Notification) {
        var host = ConfigService.host;
        var notificationId = $state.params.notificationId;

        $http.get(host + '/api/notification/getNotificationById/' + notificationId).then(function(response) {
            var notification = response.data.data[0];
            $scope.title = notification.title;
            $scope.message = notification.message;
            $scope.level = notification.level;
        });

        $scope.updateNotification = function() {
            var notification = {};
            notification.level = $scope.level;
            notification.title = $scope.title;
            notification.message = $scope.message;
            notification.datemodified = new Date();
            $http({
                method: "POST",
                url: host + '/api/notification/update/' + notificationId,
                data: notification
            }).then(function success(response) {
                $timeout(function() {
                    Notification({ message: 'Update type notification successfull', title: 'Success' });
                }, 200);
                $state.go('home.admin.notification');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }
    }
])
