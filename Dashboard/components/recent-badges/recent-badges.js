angular.module('DashboardApp')
    .component('recentBadges', {
        templateUrl: './../SiteAssets/app/Dashboard/components/recent-badges/recent-badges.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$DashboardService', recentBadgesCtrl]
    });

function recentBadgesCtrl($DashboardService){
    var ctrl = this;
    $DashboardService.getBadgesItems('$top=3').then(function(res){
        ctrl.allBadges = res;
    });
}