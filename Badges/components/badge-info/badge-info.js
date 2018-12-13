angular.module('DashboardApp')
    .component('quickLeaderboard', {
        templateUrl: './../SiteAssets/app/Dashboard/components/quick-leaderboard/quick-leaderboard.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$DashboardService', quickLeaderboardCtrl]
    });

function quickLeaderboardCtrl($DashboardService){
    var ctrl = this;
    $DashboardService.getBadgesItems().then(function(res){
        ctrl.allBadges = res;
    });
}