"use strict";
app.controller('headerCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', '$timeout', 'ConfigService', 'loginService', function($scope, $rootScope, $window, $state, $http, $timeout, ConfigService, loginService) {
    var host = ConfigService.host;

    $scope.loggedUser = angular.fromJson($window.localStorage.loggedUser);

    $scope.logout = function() {
        loginService.logout();
        $state.go('login');
    }

    $scope.changePassword = function() {
        $state.go('changepassword');
    }

    $scope.setStatusLoggedUserName = function() {
        if ($scope.isShowLoggedUserName == true) {
            $scope.isShowLoggedUserName = false;
        } else {
            $scope.isShowLoggedUserName = true;
        }
    }

    $timeout(function() {
        $('.main-navigation ul li').each(function() {
            var smWidth = $(this).find('.sub-menu').children('.block').length;
            if( smWidth == 1 ) {
                $(this).find('.sub-menu').outerWidth(205);
            }
            else if ( smWidth == 2 ) {
                $(this).find('.sub-menu').outerWidth(410);
            } else if (smWidth == 3) {
                $(this).find('.sub-menu').outerWidth(605);
            } else {
                $(this).find('.sub-menu').outerWidth(605);
            }
        });

        $('.main-navigation .sub-menu .block:nth-child(3n) + .block').addClass('clear-left');

    }, 100)

}]);
