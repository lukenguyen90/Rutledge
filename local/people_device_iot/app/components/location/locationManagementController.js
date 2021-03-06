"use strict";
app.controller('locationManagementCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', 'ConfigService',
    'loginService', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$filter', '$compile',
    function($scope, $rootScope, $window, $state, $http, ConfigService, loginService, Upload,
        DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
        var host = ConfigService.host;

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/location/getAllLocation').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('initComplete', function() {
                $('#btnSearch').on('click', function() {
                    $scope.dtInstance.DataTable.search($('#search').val()).draw();
                })
            })
            .withOption('order', [2, 'desc'])
            .withOption('bLengthChange', false);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('name').withTitle('Name'),
            DTColumnBuilder.newColumn('description').withTitle('Description'),
            DTColumnBuilder.newColumn('active').withTitle('Is Active').renderWith(renderActive),
            DTColumnBuilder.newColumn('datecreated').withTitle('Date created').renderWith(renderDate),
            DTColumnBuilder.newColumn('datemodified').withTitle('Date modified').renderWith(renderDate),
            DTColumnBuilder.newColumn('id').renderWith(getOption)
        ];

        $scope.dtInstance = {};

        function renderDate(data) {
            return $filter('date')(new Date(data), "dd MMM yyyy HH:mm:ss");
        }

        function getOption(data, type, full, meta) {
            return '<p class="seemore" ng-click="seeMore(\'' + data + '\')">See More</p>' +
                '<p class="seemore" ng-click="edit(\'' + data + '\')">Edit</p>';
        }

        $scope.seeMore = function(data) {
            $state.go('home.admin.location.detail', { locationId: data });
        }

        $scope.edit = function(data) {
            $state.go('home.admin.location.edit', { locationId: data });
        }

        $scope.addLocation = function() {
            $state.go('home.admin.location.new');
        }

        function renderActive(data) {
            if (data === 1) {
                return '<p class="label label-primary">Active</p>';
            } else {
                return '<p class="label label-danger">InActive</p>';
            }
        }
    }
]);
