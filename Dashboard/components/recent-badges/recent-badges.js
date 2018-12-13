angular.module('DashboardApp')
    .component('recentBadges', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Dashboard/components/recent-badges/recent-badges.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$DashboardService', recentBadgesCtrl]
    });

function recentBadgesCtrl($DashboardService){
    var ctrl = this;
	ctrl.allBadges = [];
    $DashboardService.getBadgesItems('$top=3').then(function(res){
        ctrl.allBadges = res;
    });
}