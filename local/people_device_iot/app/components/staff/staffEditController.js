"use strict";
app.controller('staffEditCtrl', ['$scope', '$rootScope', '$window', '$state', '$http', '$timeout',
    'ConfigService', 'loginService', 'Upload', 'Notification',
    function($scope, $rootScope, $window, $state, $http, $timeout, ConfigService, loginService, Upload, Notification) {
        var host = ConfigService.host;
        var staffId = $state.params.staffId;
        $scope.isShowBtnEditBasic = true;
        $scope.isShowBtnEditWorking = true;
        $scope.isShowBtnEditHealth = true;
        $scope.isShowBtnEditTraining = true;

        $scope.getStaffInfo = function() {
            $http.get(host + '/api/staff/getStaffById/' + staffId).then(function(response) {
                $scope.staff = response.data.data[0];
                $scope.firstname = response.data.data[0].firstname;
                $scope.lastname = response.data.data[0].lastname;
                $scope.username = response.data.data[0].username;
                $scope.gender = response.data.data[0].gender;
                $scope.department = response.data.data[0].department;
                $scope.title = response.data.data[0].title;
                $scope.email = response.data.data[0].email;
                $scope.phonenumber = response.data.data[0].phonenumber;
                $scope.picFile = response.data.data[0].avatar;
                $scope.experience = response.data.data[0].experience;
                $scope.company = response.data.data[0].company;
                $scope.bloodtype = response.data.data[0].bloodtype;
                $scope.diet = response.data.data[0].diet;
                $scope.adicted = response.data.data[0].adicted;
                $scope.drug = response.data.data[0].drug;
                $scope.metalemotionhealth = response.data.data[0].metalemotionhealth;
                $scope.position = response.data.data[0].position;
                $scope.training = response.data.data[0].training;
            });
        }

        $scope.clickBtnEditBasicInfo = function() {
            $scope.disableInformationBasic = false;
            $scope.isShowBtnSaveBasic = true;
            $scope.isShowBtnEditBasic = false;
            $scope.isShowChooseFile = true;
        }

        $scope.updateStaffBasicInfo = function(file) {
            $scope.isShowBtnEditBasic = true;
            $scope.isShowBtnSaveBasic = false;
            $scope.disableInformationBasic = true;
            var dataStaff = {};
            dataStaff.type = 'basic';
            dataStaff.avatar = $scope.avatar;
            dataStaff.title = $scope.title;
            dataStaff.firstname = $scope.firstname;
            dataStaff.lastname = $scope.lastname;
            dataStaff.email = $scope.email;
            dataStaff.phonenumber = $scope.phonenumber;
            dataStaff.gender = $scope.gender;
            dataStaff.datemodified = new Date();
            if (typeof(file) != 'string' && file != null) {
                file.upload = Upload.upload({
                    url: '/upload',
                    data: { file: file },
                });

                file.upload.then(function(response) {
                    dataStaff.avatar = '/' + response.data.file.path;
                    updateInfo(staffId, dataStaff);
                    $timeout(function() {
                        Notification({ message: 'Update Staff successfull', title: 'Success' });
                    }, 200);
                    $scope.getStaffInfo();
                    $scope.isShowChooseFile = false;

                }, function(response) {
                    if (response.status > 0)
                        $scope.errMessage = response.status + ': ' + response.data;
                }, function(evt) {});
            } else {
                dataStaff.avatar = $scope.picFile;
                updateInfo(staffId, dataStaff);
                $timeout(function() {
                    Notification({ message: 'Update Staff successfull', title: 'Success' });
                }, 200)
                $scope.getStaffInfo();
                $scope.isShowChooseFile = false;
            }
        }

        $scope.clickBtnEditWorkingInfo = function() {
            $scope.disableInformationWorking = false;
            $scope.isShowBtnSaveWorking = true;
            $scope.isShowBtnEditWorking = false;
        }

        $scope.updateStaffWorkingInfo = function(file) {
            $scope.isShowBtnEditWorking = true;
            $scope.isShowBtnSaveWorking = false;
            $scope.disableInformationWorking = true;
            var dataStaff = {};
            dataStaff.type = 'working';
            dataStaff.experience = $scope.experience;
            dataStaff.position = $scope.position;
            dataStaff.department = $scope.department;
            dataStaff.company = $scope.company;
            dataStaff.datemodified = new Date();
            updateInfo(staffId, dataStaff);
            $timeout(function() {
                Notification({ message: 'Update Staff successfull', title: 'Success' });
            }, 200)
            $scope.getStaffInfo();
        }

        $scope.clickBtnEditHealthInfo = function() {
            $scope.disableInformationHealth = false;
            $scope.isShowBtnSaveHealth = true;
            $scope.isShowBtnEditHealth = false;
        }

        $scope.updateStaffHealthInfo = function(file) {
            $scope.isShowBtnEditHealth = true;
            $scope.isShowBtnSaveHealth = false;
            $scope.disableInformationHealth = true;
            var dataStaff = {};
            dataStaff.type = 'health';
            dataStaff.bloodtype = $scope.bloodtype;
            dataStaff.diet = $scope.diet;
            dataStaff.adicted = $scope.adicted;
            dataStaff.drug = $scope.drug;
            dataStaff.metalemotionhealth = $scope.metalemotionhealth;
            dataStaff.datemodified = new Date();
            updateInfo(staffId, dataStaff);
            $timeout(function() {
                Notification({ message: 'Update Staff successfull', title: 'Success' });
            }, 200)
            $scope.getStaffInfo();
        }

        $scope.clickBtnEditTrainingInfo = function() {
            $scope.disableInformationTraining = false;
            $scope.isShowBtnSaveTraining = true;
            $scope.isShowBtnEditTraining = false;
        }

        $scope.updateStaffTrainingInfo = function(file) {
            $scope.isShowBtnEditTraining = true;
            $scope.isShowBtnSaveTraining = false;
            $scope.disableInformationTraining = true;
            var dataStaff = {};
            dataStaff.type = 'training';
            dataStaff.training = $scope.training;
            dataStaff.datemodified = new Date();
            updateInfo(staffId, dataStaff);
            $timeout(function() {
                Notification({ message: 'Update Staff successfull', title: 'Success' });
            }, 200)
            $scope.getStaffInfo();
        }

        function updateInfo(staffId, staffInfo) {
            $http({
                method: "POST",
                url: host + '/api/staff/updateStaff/' + staffId,
                data: staffInfo
            }).then(function success(response) {
                //$state.go('home.admin.staff.edit',{staffId:staffId});
            }, function error(response) {
                $scope.errMessage = true;
            });
        }
    }
]);
