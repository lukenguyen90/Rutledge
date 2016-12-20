"use strict";
app.controller('staffNewCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', '$timeout',
    'ConfigService', 'loginService', 'Upload', 'md5',
    function($scope, $rootScope, $window, $state, $http, $timeout, ConfigService, loginService, Upload, md5) {
        var host = ConfigService.host;
        var staffId = $state.params.staffId;

        $scope.clickBtnSaveBasicInfo = function(file) {
            var dataStaff = {};
            dataStaff.type = 'basic';
            dataStaff.avatar = $scope.avatar;
            dataStaff.title = $scope.title;
            dataStaff.firstname = $scope.firstname;
            dataStaff.username = $scope.username;
            dataStaff.lastname = $scope.lastname;
            dataStaff.email = $scope.email;
            dataStaff.phonenumber = $scope.phonenumber;
            dataStaff.gender = $scope.gender;

            dataStaff.experience = $scope.experience;
            dataStaff.position = $scope.position;
            dataStaff.department = $scope.department;
            dataStaff.company = $scope.company;

            dataStaff.bloodtype = $scope.bloodtype;
            dataStaff.diet = $scope.diet;
            dataStaff.adicted = $scope.adicted;
            dataStaff.drug = $scope.drug;
            dataStaff.metalemotionhealth = $scope.metalemotionhealth;
            dataStaff.password = md5.createHash('123456');
            dataStaff.training = $scope.training;

            dataStaff.datecreated = new Date();
            if ($scope.username != undefined) {
                $http({
                    method: "GET",
                    url: host + '/api/staff/checkUsernameExists/' + $scope.username
                }).then(function success(response) {
                    if (response.data.data[0] === undefined) {
                        if (typeof(file) != 'undefined') {
                            file.upload = Upload.upload({
                                url: '/upload',
                                data: { file: file },
                            });

                            file.upload.then(function(response) {
                                dataStaff.avatar = '/' + response.data.file.path;
                                saveInfo(dataStaff);

                            }, function(response) {
                                if (response.status > 0)
                                    $scope.errMessage = true;
                            }, function(evt) {});
                        } else {
                            saveInfo(dataStaff);
                        }
                    } else {
                        $scope.usernameExits = true;
                    }

                }, function error(response) {
                    $scope.errMessage = true;
                });
            } else {
                $scope.errFill = true;
            }

        }

        function saveInfo(staffInfo) {
            $http({
                method: "POST",
                url: host + '/api/staff/addStaff',
                data: staffInfo
            }).then(function success(response) {
                $state.go('home.admin.staff');
            }, function error(response) {
                $scope.errMessage = true;
            });
        }
    }
]);
