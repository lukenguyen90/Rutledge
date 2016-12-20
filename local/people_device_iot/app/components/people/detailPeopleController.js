"use strict";
app.controller('detailPeopleCtrl', ['$scope', '$state', '$http', '$timeout', 'ConfigService',
    function($scope, $state, $http, $timeout, ConfigService) {
        var host = ConfigService.host;
        var staffId = $state.params.staffId;

        $scope.getStaffInfo = function() {
            $http.get(host + '/api/staff/getStaffById/' + staffId).then(function(response) {
                var data = response.data.data[0];
                $scope.staff = data;
                $scope.firstname = data.firstname;
                $scope.lastname = data.lastname;
                $scope.gender = data.gender;
                $scope.department = data.department;
                $scope.title = data.title;
                $scope.email = data.email;
                $scope.phonenumber = data.phonenumber;
                $scope.picFile = data.avatar;
                $scope.experience = data.experience;
                $scope.bloodtype = data.bloodtype;
                $scope.diet = data.diet;
                $scope.adicted = data.adicted;
                $scope.drug = data.drug;
                $scope.metalemotionhealth = data.metalemotionhealth;
                $scope.position = data.position;
                $scope.username = data.username;
                $scope.training = data.training;
            });
        }
    }
]);
