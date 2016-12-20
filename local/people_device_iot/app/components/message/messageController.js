"use strict";
app.controller('messageCtrl', ['$scope', '$http', '$filter', '$state', '$compile', 'ConfigService', 
    function($scope, $http, $filter, $state, $compile, ConfigService) {
        var host = ConfigService.host;   
   

         $http.get(host + '/api/staff/getDeployStaff').then(function(res) {
                $scope.list_staff = res.data.data; 
                console.log(res.data.data)               
            });

        $scope.sendMessage = function() {       
           
            var dataMessage = {};
            var chipid = [];
            if($scope.chipid==0){
                for (var i = 0; i < $scope.list_staff.length; i++) {
                    chipid.push($scope.list_staff[i].chipid);
                }
            }else{
                chipid.push($scope.chipid);
            }
         
            dataMessage.deviceid = chipid;
            dataMessage.message = $scope.message;                      
            $http.post('/sendMessage',dataMessage).then(function(res){
                console.log(res);
            });
        }
    }
])
