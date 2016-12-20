"use strict";
app.controller('peopleListing', ['$scope', '$http', '$timeout', 'ConfigService', '$window',
    function($scope, $http, $timeout, ConfigService, $window) {
        var host = ConfigService.host;
        var pagenumber = 1;
        var itemsPerPage = 10;
        $scope.itemClass = "list-item";
        $scope.class_btn_tab_1 = "tab-active";
        $scope.class_btn_tab_2 = "";
        $scope.class_btn_tab_3 = "";
        $scope.view_table_1 = "";
        $scope.view_table_2 = "hide";
        $scope.items_on_row = "five";
        $scope.img_width = "100%";
        $scope.isShowMore10 = true;
        var activeTabNumber = 1 ;

        $scope.showMore = function(itemsPerPage) {
            $scope.itemClass = 'list-item10';
            $http.get(host + '/api/staff/countStaff').then(function(response) {
                if (response.data.data[0].total < itemsPerPage) {
                    $scope.itemsPerPage = response.data.data[0].total;
                } else {
                    $scope.itemsPerPage = itemsPerPage;
                }
            })
            $http.get(host + '/api/staff/getStaffLimit/' + itemsPerPage).then(function(response) {
                var data = response.data;
                $scope.people_listing = data.data;
            })
        }

        $scope.getInfoStaff = function(pagenumber) {
            $http.get(host + '/api/staff/getAllStaff/' + pagenumber + '/' + itemsPerPage).then(function(response) {
                var data = response.data;
                $scope.people_listing = data.data;
                $scope.total_entries = data.statistic.totalStaff;
                viewShowMoreBtn();
                $scope.total_page = data.statistic.totalPage;
                if (data.statistic.totalStaff < itemsPerPage) {
                    $scope.itemsPerPage = data.statistic.totalStaff;
                } else {
                    if (pagenumber * itemsPerPage > data.statistic.totalStaff) {
                        $scope.itemsPerPage = data.statistic.totalStaff;
                    } else {
                        $scope.itemsPerPage = pagenumber * itemsPerPage;
                    }
                }
            });
        }

        $scope.range = function(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);
            return input;
        };
        $scope.current = 1;

        $scope.nextPage = function(pagenumber) {
            $scope.current = pagenumber;
            $scope.getInfoStaff(pagenumber);
        }

        $scope.btnNextPage = function(current) {

        }
        $scope.activeTab = function(tabnumber) {
            activeTabNumber = tabnumber ;
            $scope.class_btn_tab_1 = "";
            $scope.class_btn_tab_2 = "";
            $scope.class_btn_tab_3 = "";
            switch(tabnumber){
                case 1:
                    $scope.class_btn_tab_1 = "tab-active";
                    $scope.items_on_row = "five";
                    $scope.img_width = "100%";
                break;
                case 2:
                    $scope.class_btn_tab_2 = "tab-active";
                    $scope.itemClass = 'list-item';
                    $scope.items_on_row = "one";
                    $scope.img_width = "auto";
                break;
                case 3:
                    $scope.class_btn_tab_3 = "tab-active";
                break;
            }
            viewShowMoreBtn();
            showTabContent(tabnumber);
        }
        function showTabContent(tabnumber) {
            switch(tabnumber){
                case 1:
                case 2:
                    $scope.view_table_1 = "";
                    $scope.view_table_2 = "hide";
                break;
                case 3:
                    $scope.view_table_1 = "hide";
                    $scope.view_table_2 = "";
                break;
            }
        }
        function viewShowMoreBtn(){
            switch(activeTabNumber){
                case 2:
                case 3:
                    $scope.isShowMore10 = false;
                    $scope.isShowMore20 = false;
                    $scope.isShowMore40 = false;
                break;
                default:
                    $scope.isShowMore10 = true;
                    if (($scope.total_entries >= 10 && $scope.total_entries <= 20) || $scope.total_entries > 20) {
                        $scope.isShowMore20 = true;
                    }
                    if ($scope.total_entries > 20 || $scope.total_entries > 40) {
                        $scope.isShowMore20 = true;
                        $scope.isShowMore40 = true;
                    }
                break;
            }
        }

        function tabactions() {
            $('.tabclass').each(function() {
                if ($(this).hasClass('tab-active')) {
                    $(this).removeClass('tab-active');
                }
            });
        }

        $timeout(function() {
            /* Horizontal people listing */
            $('.people-listing.horizontal-list .list-item:nth-child(even) + .list-item').addClass('clear-left-tablet');
            $('.people-listing.horizontal-list:not(.five) .list-item:nth-child(5n) + .list-item').addClass('clear-left');
            $('.people-listing.horizontal-list.five .list-item:nth-child(5n) + .list-item').addClass('clear-left');

        }, 100)
    }
]);
