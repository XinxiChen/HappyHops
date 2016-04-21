angular.module('nibs.bar', ['openfb', 'nibs.status', 'nibs.activity', 'nibs.wallet'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.bars', {
                url: "/bars",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/bar-list.html",
                        controller: "BarListCtrl"
                    }
                }
            })

            .state('app.bar-detail', {
                url: "/bars/:barId",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/bar-detail.html",
                        controller: "BarDetailCtrl"
                    }
                }
            })

            .state('app.bar-redeem', {
                url: "/bars/:barId/redeem",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/redeem.html",
                        controller: "BarDetailCtrl"
                    }
                }
            })

    })

    // Services
    .factory('Bar', function ($http, $rootScope) {
        return {
            all: function() {
                return $http.get($rootScope.server.url + '/bars');
            },
            get: function(barId) {
                return $http.get($rootScope.server.url + '/bars/' + barId);
            }
        };
    })

    //Controllers
    .controller('BarListCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, Bar, User) {
        Bar.all().success(function(bars) {
            $scope.bars = bars;
        });

        $scope.doRefresh = function() {
            $scope.bars = Bar.all().success(function(bars) {
                $scope.bars = bars;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
    })

    .controller('BarDetailCtrl', function ($rootScope, $scope, $state, $ionicPopup, $stateParams, Bar, OpenFB, WalletItem, Activity, Status) {

        Bar.get($stateParams.barId).success(function(bar) {
            $scope.bar = bar;
            // $scope.timeago = offer.createdtime - (new Date()).getTime();

        });

        $scope.shareOnFacebook = function (bar) {
//      Uncomment to enable actual "Share on Facebook" feature
//            OpenFB.post('/me/feed', {name: offer.name, link: offer.campaignPage, picture: offer.image, caption: 'Offer ends soon!', description: offer.description})
//                .success(function() {
//                    Status.show('Shared on Facebook!');
//                    var activity = new Activity({type: "Shared on Facebook", points: 1000, offerId: $scope.offer.sfid, name: $scope.offer.name, image: $scope.offer.image});
//                    activity.$save(Status.checkStatus);
//                })
//                .error(function() {
//                    $ionicPopup.alert({title: 'Facebook', content: 'Something went wrong while sharing this offer.'});
//                });
            Status.show('Shared on Facebook!');
            Activity.create({type: "Shared on Facebook", points: 1000, barId: $scope.bar.sfid, name: $scope.bar.name, image: $scope.bar.image})
                .success(function(status) {
                    Status.checkStatus(status);
                });

        };

        $scope.shareOnTwitter = function () {
            Status.show('Shared on Twitter!');
            Activity.create({type: "Shared on Twitter", points: 1000, barId: $scope.bar.sfid, name: $scope.bar.name, image: $scope.bar.image})
                .success(function(status) {
                    Status.checkStatus(status);
                });
        };

        $scope.shareOnGoogle = function () {
            Status.show('Shared on Google+!');
            Activity.create({type: "Shared on Google+", points: 1000, barId: $scope.bar.sfid, name: $scope.bar.name, image: $scope.bar.image})
                .success(function(status) {
                    Status.checkStatus(status);
                });
        };

        $scope.saveToWallet = function () {
            WalletItem.create({barId: $scope.bar.id}).success(function(status) {
                Status.show('Saved to your wallet!');
                Activity.create({type: "Saved to Wallet", points: 1000, barId: $scope.bar.sfid, name: $scope.bar.name, image: $scope.bar.image})
                    .success(function(status) {
                        Status.checkStatus(status);
                    });
            });
        };

        $scope.redeem = function () {
            Activity.create({type: "Redeemed Bar", points: 1000, barId: $scope.bar.sfid, name: $scope.bar.name, image: $scope.bar.image})
                .success(function(status) {
                    Status.checkStatus(status);
                });
            $state.go('app.bar-redeem', {barId: $scope.bar.id});
        };

    });
