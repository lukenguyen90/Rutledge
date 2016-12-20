'use strict';

app.config(function($stateProvider, $urlRouterProvider, $transitionsProvider) {

    $transitionsProvider.onStart({
        to: function(state) {
            return state.requireAuthen === undefined ? true : false;
        }
    }, function($transition$, $state, userService) {
        if (!userService.isLogin()) {
            return $state.go('login');
        }

    });

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'header@': {
                    templateUrl: '/app/shared/header.html',
                    controller: 'headerCtrl'
                },
                'content@': {
                    templateUrl: '/app/shared/content.html',
                },
                'footer@': {
                    templateUrl: '/app/shared/footer.html',
                }
            }
        })
        .state('home.people', {
            url: 'people',
            views: {
                'content@': {
                    templateUrl: '/app/components/people/listing.html',
                    controller: 'peopleListing'
                }
            }
        })
        .state('home.demo', {
            url: 'demo',
            views: {
                'content@': {
                    templateUrl: '/app/components/demo/demo.html',
                    controller: 'demoCtrl'
                }
            }
        })
        .state('home.testcanvas', {
            url: 'testcanvas',
            views: {
                'content@': {
                    templateUrl: '/app/components/testcanvas/index.html',
                    controller: 'testcanvasCtrl'
                }
            }
        })
        .state('home.people.detail', {
            url: '/detail/:staffId',
            views: {
                'content@': {
                    templateUrl: '/app/components/people/detailpeople.html',
                    controller: 'detailPeopleCtrl'
                }
            }
        })
        .state('home.location', {
            url: 'location',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/listing.html',
                    controller: 'locationCtrl'
                }
            }
        })
        .state('home.admin.location', {
            url: '/location',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/locationmanagement.html',
                    controller: 'locationManagementCtrl'
                }
            }
        })
        .state('home.admin.location.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/locationnew.html',
                    controller: 'locationNewCtrl'
                }
            }
        })
        .state('home.admin.location.edit', {
            url: '/edit/:locationId',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/locationedit.html',
                    controller: 'locationEditCtrl'
                }
            }
        })
        .state('home.admin.location.detail', {
            url: '/detail/:locationId',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/locationdetail.html',
                    controller: 'locationDetailCtrl'
                }
            }
        })
        .state('home.location.zone', {
            url: '/:locationId/:locationName',
            views: {
                'content@': {
                    templateUrl: '/app/components/zone/listing.html',
                    controller: 'zoneCtrl'
                }
            }
        })
        .state('home.admin.zone', {
            url: '/zone',
            views: {
                'content@': {
                    templateUrl: '/app/components/zone/zonemanagement.html',
                    controller: 'zoneManagementCtrl'
                }
            }
        })
        .state('home.admin.zone.edit', {
            url: '/edit/:zoneId',
            views: {
                'content@': {
                    templateUrl: '/app/components/zone/zoneedit.html',
                    controller: 'zoneEditCtrl'
                }
            }
        })
        .state('home.admin.zone.detail', {
            url: '/detail/:zoneId',
            views: {
                'content@': {
                    templateUrl: '/app/components/zone/zonedetail.html',
                    controller: 'zoneDetailCtrl'
                }
            }
        })
        .state('home.admin.zone.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: '/app/components/zone/zonenew.html',
                    controller: 'zoneNewCtrl'
                }
            }
        })
        .state('home.admin.room', {
            url: '/room',
            views: {
                'content@': {
                    templateUrl: '/app/components/room/roommanagement.html',
                    controller: 'roomManagementCtrl'
                }
            }
        })
        .state('home.admin.room.detail', {
            url: '/detail/:roomId',
            views: {
                'content@': {
                    templateUrl: '/app/components/room/roomdetail.html',
                    controller: 'roomDetailCtrl'
                }
            }
        })
        .state('home.admin.room.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: '/app/components/room/roomnew.html',
                    controller: 'roomNewCtrl'
                }
            }
        })
        .state('home.admin.room.edit', {
            url: '/edit/:roomId',
            views: {
                'content@': {
                    templateUrl: '/app/components/room/roomedit.html',
                    controller: 'roomEditCtrl'
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'login@': {
                    templateUrl: '/app/components/login/login.html',
                    controller: 'loginCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.peopleiot', {
            url: 'people-iot-locator',
            views: {
                'content@': {
                    templateUrl: '/app/components/peopleIOT/peopleIOT.html',
                    controller: 'peopleIOTCtrl'
                }
            },
            requireAuthen: false
        })
        // .state('home.peopleiot', {
        //     url: 'people-iot-canvas',
        //     views: {
        //         'content@': {
        //             templateUrl: '/app/components/peopleIOT/peopleIOTCanvas.html',
        //             controller: 'peopleIOTCtrl'
        //         }
        //     },
        //     requireAuthen: false
        // })
        .state('home.peopleiot.replayvideo', {
            url: '/replay-video',
            views: {
                'content@': {
                    templateUrl: '/app/components/peopleIOT/replayVideo.html',
                    controller: 'replayVideoCtrl'
                }
            }
        })
        .state('home.device', {
            url: 'device',
            views: {
                'content@': {
                    templateUrl: '/app/components/device/listing.html',
                    controller: 'deviceCtrl'
                }
            }
        })
        .state('home.device.detail', {
            url: '/detail/:deviceId',
            views: {
                'content@': {
                    templateUrl: '/app/components/device/detail.html',
                    controller: 'deviceDetailCtrl'
                }
            }
        })
        .state('home.admin.typedevice', {
            url: '/typedevice',
            views: {
                'content@': {
                    templateUrl: '/app/components/typedevice/listing.html',
                    controller: 'typedeviceCtrl'
                }
            }
        })
        .state('home.admin.typedevice.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: '/app/components/typedevice/addtype.html',
                    controller: 'createTypeDeviceCtrl'
                }
            }
        })
        .state('home.admin.typedevice.edit', {
            url: '/edit/:typeid',
            views: {
                'content@': {
                    templateUrl: '/app/components/typedevice/edittype.html',
                    controller: 'editTypeDeviceCtrl'
                }
            }
        })
        .state('home.admin.typedevice.detail', {
            url: '/detail/:typeid',
            views: {
                'content@': {
                    templateUrl: '/app/components/typedevice/detail.html',
                    controller: 'detailTypeDeviceCtrl'
                }
            }
        })
        .state('home.notification', {
            url: 'notification',
            views: {
                'content@': {
                    templateUrl: '/app/components/notification/listing.html',
                    controller: 'notificationCtrl'
                }
            }
        })
        .state('home.notification.detail', {
            url: '/:notificationId',
            views: {
                'content@': {
                    templateUrl: '/app/components/notification/notificationdetail.html',
                    controller: 'notificationDetailCtrl'
                }
            }
        })
        .state('home.admin.notification', {
            url: '/notification',
            views: {
                'content@': {
                    templateUrl: '/app/components/notification/notificationmanagemnet.html',
                    controller: 'notificationManagementCtrl'
                }
            }
        })
        .state('home.admin.notification.edit', {
            url: '/edit/:notificationId',
            views: {
                'content@': {
                    templateUrl: '/app/components/notification/notificationedit.html',
                    controller: 'notificationEditCtrl'
                }
            }
        })
        .state('home.admin.notification.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: '/app/components/notification/newnotification.html',
                    controller: 'notificationNewCtrl'
                }
            }
        })
        .state('home.deviceiot', {
            url: 'device-iot',
            views: {
                'content@': {
                    templateUrl: '/app/components/deviceIOT/deviceIOT.html',
                    controller: 'deviceIOTCtrl'
                }
            }
        })
        .state('home.profile', {
            url: 'profile/:staffId',
            views: {
                'content@': {
                    templateUrl: '/app/components/profile/profile.html',
                    controller: 'profileCtrl'
                }
            }
        })
        .state('home.deployzonedevice', {
            url: 'deployzonedevice/:zoneId',
            views: {
                'content@': {
                    templateUrl: '/app/components/deployzonedevice/deployzonedevice.html',
                    controller: 'deployzonedeviceCtrl'
                }
            }
        })
        .state('home.admin', {
            url: 'admin'
        })
        .state('home.admin.devicelist', {
            url: '/listdevice',
            views: {
                'content@': {
                    templateUrl: '/app/components/device/adminList.html',
                    controller: 'adminLstDeviceCtrl'
                }
            }
        })
        .state('home.admin.devicedeploy', {
            url: '/device-deploy',
            views: {
                'content@': {
                    templateUrl: '/app/components/device/deploy.html',
                    controller: 'deviceDeployCtrl'
                }
            }
        })
        .state('home.admin.deviceadd', {
            url: '/adddevice',
            views: {
                'content@': {
                    templateUrl: '/app/components/device/addDevice.html',
                    controller: 'deviceNewCtrl'
                }
            }
        })
        .state('home.admin.deviceedit', {
            url: '/editdevice/:deviceId',
            views: {
                'content@': {
                    templateUrl: '/app/components/device/editDevice.html',
                    controller: 'deviceEditCtrl'
                }
            }
        })
        .state('home.admin.staff', {
            url: '/staff',
            views: {
                'content@': {
                    templateUrl: '/app/components/staff/listing.html',
                    controller: 'staffCtrl'
                }
            }
        })
        .state('home.admin.staff.new', {
            url: '/new',
            views: {
                'content@': {
                    templateUrl: '/app/components/staff/staffnew.html',
                    controller: 'staffNewCtrl'
                }
            }
        })
        .state('home.admin.staff.edit', {
            url: '/edit/:staffId',
            views: {
                'content@': {
                    templateUrl: '/app/components/staff/staffedit.html',
                    controller: 'staffEditCtrl'
                }
            }
        })
        .state('home.admin.staff.detail', {
            url: '/detail/:staffId',
            views: {
                'content@': {
                    templateUrl: '/app/components/staff/staffdetail.html',
                    controller: 'staffDetailCtrl'
                }
            }
        })

        .state('home.admin.assigndevice', {
            url: '/assign-device',
            views: {
                'content@': {
                    templateUrl: '/app/components/assigndevice/assignform.html',
                    controller: 'assignDeviceCtrl'
                }
            }
        })
        .state('home.message', {
            url: '/message',
            views: {
                'content@': {
                    templateUrl: '/app/components/message/message.html',
                    controller: 'messageCtrl'
                }
            }
        })
});
