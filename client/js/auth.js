angular.module('nibs.auth', ['openfb', 'nibs.config'])
    /*
     * Routes
     */
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/login.html",
                        controller: "LoginCtrl"
                    }
                }
            })


            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/homepage.html",
                        controller: "LogoutCtrl"
                    }
                }
            })

            .state('app.signup', {
                url: "/signup",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/signup.html",
                        controller: "SignupCtrl"
                    }
                }
            })

            .state('app.bartenderlogin', {
                url: "/bartenderlogin",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/bartenderlogin.html",
                        controller: "BartenderLoginCtrl"
                    }
                }
            })

            .state('app.bartenderlogout', {
                url: "/bartenderlogout",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/homepage.html",
                        controller: "BartenderLogoutCtrl"
                    }
                }
            })

            .state('app.bartendersignup', {
                url: "/bartendersignup",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/bartendersignup.html",
                        controller: "BartenderSignupCtrl"
                    }
                }
            })

    })

    /*
     * REST Resources
     */
    .factory('Auth', function ($http, $window, $rootScope) {

        return {
            login: function (user) {
                return $http.post($rootScope.server.url + '/login', user)
                    .success(function (data) {
                        $rootScope.user = data.user;
                        $window.localStorage.user = JSON.stringify(data.user);
                        $window.localStorage.token = data.token;

                        console.log('Subscribing for Push as ' + data.user.email);
                        if (typeof(ETPush) != "undefined") {
                            ETPush.setSubscriberKey(
                                function() {
                                    console.log('setSubscriberKey: success');
                                },
                                function(error) {
                                    alert('Error setting Push Notification subscriber');
                                },
                                data.user.email
                            );
                        }

                    });
            },
            fblogin: function (fbUser) {
                console.log(JSON.stringify(fbUser));
                return $http.post($rootScope.server.url + '/fblogin', {user:fbUser, token: $window.localStorage['fbtoken']})
                    .success(function (data) {
                        $rootScope.user = data.user;
                        $window.localStorage.user = JSON.stringify(data.user);
                        $window.localStorage.token = data.token;

                        console.log('Subscribing for Push as ' + data.user.email);
                        if (typeof(ETPush) != "undefined") {
                            ETPush.setSubscriberKey(
                                function() {
                                    console.log('setSubscriberKey: success');
                                },
                                function(error) {
                                    alert('Error setting Push Notification subscriber');
                                },
                                data.user.email
                            );
                        }

                    });
            },
            logout: function () {
                $rootScope.user = undefined;
                var promise = $http.post($rootScope.server.url + '/logout');
                $window.localStorage.removeItem('user');
                $window.localStorage.removeItem('token');
                return promise;
            },
            signup: function (user) {
                return $http.post($rootScope.server.url + '/signup', user);
            },

            bartenderlogin: function (user) {
                return $http.post($rootScope.server.url + '/bartenderlogin', user)
                    .success(function (data) {
                        $rootScope.user = data.user;
                        $window.localStorage.user = JSON.stringify(data.user);
                        $window.localStorage.token = data.token;

                        console.log('Subscribing for Push as ' + data.user.email);
                        if (typeof(ETPush) != "undefined") {
                            ETPush.setSubscriberKey(
                                function() {
                                    console.log('setSubscriberKey: success');
                                },
                                function(error) {
                                    alert('Error setting Push Notification subscriber');
                                },
                                data.user.email
                            );
                        }

                    });
            },

            bartenderlogout: function () {
                $rootScope.user = undefined;
                var promise = $http.post($rootScope.server.url + '/bartenderlogout');
                $window.localStorage.removeItem('user');
                $window.localStorage.removeItem('token');
                return promise;
            },
            bartendersignup: function (user) {
                console.log("Enter Client bartender signup");

                return $http.post($rootScope.server.url + '/bartendersignup', user);
            }

        }
    })


    /*
     * Controllers
     */
    .controller('LoginCtrl', function ($scope, $rootScope, $state, $window, $location, $ionicViewService, $ionicPopup, $ionicModal, Auth, OpenFB) {

        $ionicModal.fromTemplateUrl('templates/server-url-setting.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openAppDialog = function() {
            $scope.modal.show();
        };

        $scope.$on('modal.hidden', function(event) {
            $window.localStorage.setItem('serverURL', $rootScope.server.url);
        });

        $window.localStorage.removeItem('user');
        $window.localStorage.removeItem('token');

        $scope.user = {};

        $scope.login = function () {

            Auth.login($scope.user)
                .success(function (data) {
                    $state.go("app.offers");
                })
                .error(function (err) {
                    $ionicPopup.alert({title: 'Oops', content: err});
                });
        };

        $scope.facebookLogin = function () {

            OpenFB.login('email, publish_actions').then(
                function () {
                    OpenFB.get('/me', {fields: 'id,first_name,last_name,email,picture,birthday,gender'})
                        .success(function (fbUser) {
                            Auth.fblogin(fbUser)
                                .success(function (data) {
                                    $state.go("app.profile");
                                    setTimeout(function () {
                                        $ionicViewService.clearHistory();
                                    });
                                })
                                .error(function (err) {
                                    console.log(JSON.stringify(err));
                                    $ionicPopup.alert({title: 'Oops', content: err});
                                })
                        })
                        .error(function () {
                            $ionicPopup.alert({title: 'Oops', content: "The Facebook login failed"});
                        });
                },
                function () {
                    $ionicPopup.alert({title: 'Oops', content: "The Facebook login failed"});
                });
        };

    })

    .controller('LogoutCtrl', function ($rootScope, $window) {
        console.log("Logout");
        $rootScope.user = null;
        $window.localStorage.removeItem('user');
        $window.localStorage.removeItem('token');

    })

    .controller('SignupCtrl', function ($scope, $state, $ionicPopup, Auth, OpenFB) {

        $scope.user = {};

        $scope.signup = function () {
            if ($scope.user.password !== $scope.user.password2) {
                $ionicPopup.alert({title: 'Oops', content: "passwords don't match"});
                return;
            }
            Auth.signup($scope.user)
                .success(function (data) {
                    $state.go("app.login");
                });
        };

        $scope.facebookLogin = function () {

            OpenFB.login('email, publish_actions').then(
                function () {
                    OpenFB.get('/me', {fields: 'id,first_name,last_name,email,picture,birthday,gender'})
                        .success(function (fbUser) {
                            Auth.fblogin(fbUser)
                                .success(function (data) {
                                    $state.go("app.profile");
                                    setTimeout(function () {
                                        $ionicViewService.clearHistory();
                                    });
                                })
                                .error(function (err) {
                                    $ionicPopup.alert({title: 'Oops', content: err});
                                })
                        })
                        .error(function () {
                            $ionicPopup.alert({title: 'Oops', content: "The Facebook login failed"});
                        });
                },
                function () {
                    $ionicPopup.alert({title: 'Oops', content: "The Facebook login failed"});
                });
        };

    })


/*
     * Controllers for Bartenders
     */
    .controller('BartenderLoginCtrl', function ($scope, $rootScope, $state, $window, $location, $ionicViewService, $ionicPopup, $ionicModal, Auth) {

        $ionicModal.fromTemplateUrl('templates/server-url-setting.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openAppDialog = function() {
            $scope.modal.show();
        };

        $scope.$on('modal.hidden', function(event) {
            $window.localStorage.setItem('serverURL', $rootScope.server.url);
        });

        $window.localStorage.removeItem('user');
        $window.localStorage.removeItem('token');

        $scope.user = {};

        $scope.bartenderlogin = function () {

            Auth.bartenderlogin($scope.user)
                .success(function (data) {
                    $state.go("app.post");
                })
                .error(function (err) {
                    $ionicPopup.alert({title: 'Oops', content: err});
                });
        };

    })

    .controller('BartenderLogoutCtrl', function ($rootScope, $window) {
        console.log("Bartender Logout");
        $rootScope.user = null;
        $window.localStorage.removeItem('user');
        $window.localStorage.removeItem('token');

    })

    .controller('BartenderSignupCtrl', function ($scope, $state, $ionicPopup, Auth) {
        console.log("Enter bartender signup controller");

        $scope.user = {};

        $scope.bartendersignup = function () {
            if ($scope.user.password !== $scope.user.password2) {
                $ionicPopup.alert({title: 'Oops', content: "passwords don't match"});
                return;
            }
            Auth.bartendersignup($scope.user)
                .success(function (data) {
                    $state.go("app.bartenderlogin");
                });
        };

    });
