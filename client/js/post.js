angular.module('nibs.post', ['openfb', 'nibs.status', 'nibs.activity', 'nibs.wallet'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.post', {
                url: "/post",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/post.html",
                        controller: "PostCtrl"
                    }
                }
            })

            .state('app.postcomplete', {
                url: "/post-complete",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/post-complete.html",
                        controller: "PostCtrl"
                    }
                }
            })



    })
    // Services for getting and updatting bartender profile
    .factory('User', function ($http, $rootScope) {
        return {
            get: function () {
                return $http.get($rootScope.server.url + '/bartenderusers/bartender', null)
            },

            update: function (user) {
                return $http.put($rootScope.server.url + '/bartenderusers/bartender', bartenderuser)
            },
            bartenderpost: function (bartenderuser) {
                console.log("Enter Client bartender post");

                return $http.post($rootScope.server.url + '/bartenderusers/post', bartenderuser);
            }
        };

    })

    // Services
    .factory('Offer', function ($http, $rootScope) {
        return {
            all: function() {
                return $http.get($rootScope.server.url + '/offers');
            },
            get: function(offerId) {
                return $http.get($rootScope.server.url + '/offers/' + offerId);
            }
        };
    })

    //Controllers
    .controller('PostCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, Offer, User) {
        Offer.all().success(function(offers) {
            $scope.offers = offers;
        });

        $scope.doRefresh = function() {
            $scope.offers = Offer.all().success(function(offers) {
                $scope.offers = offers;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        /* Get user information */

        User.get().success(function(bartenderuser) {
            $scope.bartenderuser = bartenderuser;
            // $scope.statusLabel = STATUS_LABELS[user.status - 1];
            // $scope.statusDescription = STATUS_DESCRIPTIONS[user.status - 1];
        });

        $scope.bartenderpost = function(){
            User.bartenderpost($scope.bartenderuser)
                // .success(function (data) {
                //         $state.go("app.postcomplete");
                //     })
                //     .error(function (err) {
                //         $ionicPopup.alert({title: 'Oops', content: err});
                //     });
        };
    });
