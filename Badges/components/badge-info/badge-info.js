angular.module('BadgesApp')
    .component('badgeInfo', {
        templateUrl: './../SiteAssets/app/Badges/components/badge-info/badge-info.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$BadgesService', badgeInfoCtrl]
    });

function badgeInfoCtrl($BadgesService){
    var ctrl = this;
    $BadgesService.getBadgesItems().then(function(res){
        ctrl.allBadges = res;
    });
}