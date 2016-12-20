"use strict";
app.controller('staffCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', 'ConfigService',
    'loginService', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$filter', '$compile',
    function($scope, $rootScope, $window, $state, $http, ConfigService, loginService, Upload,
        DTOptionsBuilder, DTColumnBuilder, $filter, $compile) {
        var host = ConfigService.host;

        $scope.dtOptions = DTOptionsBuilder.fromSource(host + '/api/staff/getAllStaffNoneLimit').withDataProp('data')
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('initComplete', function() {
                $('#btnSearch').on('click', function() {
                    $scope.dtInstance.DataTable.search($('#search').val()).draw();
                })
            })
            .withOption('order', [6, 'desc'])
            .withOption('bLengthChange', false);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('lastname').withTitle('Lastname'),
            DTColumnBuilder.newColumn('firstname').withTitle('Firstname'),
            DTColumnBuilder.newColumn('email').withTitle('Email'),
            DTColumnBuilder.newColumn('phonenumber').withTitle('Phone'),
            DTColumnBuilder.newColumn('department').withTitle('department'),
            DTColumnBuilder.newColumn('active').withTitle('Status').renderWith(renderStatus),
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
            $state.go('home.admin.staff.detail', { staffId: data });
        }

        $scope.edit = function(data) {
            $state.go('home.admin.staff.edit', { staffId: data });
        }

        function renderStatus(data) {
            if (data === 1) {
                return 'Active';
            } else {
                return 'Inactive';
            }
        }

        $http.get(host + '/api/staff/countStaff').then(function(response) {
            $scope.totalStaff = response.data.data[0].total;
        });

        $scope.addStaff = function() {
            $state.go('home.admin.staff.new');
        }
    }
]);
