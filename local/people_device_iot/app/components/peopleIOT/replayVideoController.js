"use strict";
app.controller('replayVideoCtrl', ['$scope', '$http', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', '$state', '$compile', function($scope, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile) {

    $scope.dtOptions = DTOptionsBuilder.fromSource("assets/data/replayvideo.json")
        .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $compile(nRow)($scope);
        });
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('name').withTitle('Name'),
        DTColumnBuilder.newColumn('date').withTitle('Date'),
        DTColumnBuilder.newColumn('time').withTitle('Time'),
        DTColumnBuilder.newColumn('action').withTitle('Action'),
        DTColumnBuilder.newColumn('room').withTitle('Room')
    ];
}])
