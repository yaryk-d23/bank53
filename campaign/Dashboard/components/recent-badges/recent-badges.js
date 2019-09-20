
angular.module('DashboardApp')
    .component('recentBadges', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Dashboard/components/recent-badges/recent-badges.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$DashboardService', '$q', '$filter', recentBadgesCtrl]
    });

function recentBadgesCtrl($DashboardService, $q, $filter){
    var ctrl = this;
	ctrl.allBadges = [];
    var requests = {
        allBadges: $DashboardService.getBadgesItems(),
        allTask: $DashboardService.getTaskItems(),
        tasksListItems: $DashboardService.getTaskListItems(),
    };
    $q.all(requests).then(function(res){
        var grupedTaskByBadge = groupBy(res.allTask, 'BadgeId');
        var grupedTasksItemsByBadge = groupBy(res.tasksListItems, 'BadgeId');

        angular.forEach(res.allBadges, function(badge, key){
            if(grupedTaskByBadge[badge.Id] && grupedTaskByBadge[badge.Id].length == grupedTasksItemsByBadge[badge.Id].length){
                groupTask = $filter('orderBy')(grupedTaskByBadge[badge.Id], '-Created');
                badge.Created = groupTask[0].Created;
                ctrl.allBadges.push(badge);
            }
            // angular.forEach(grupedTaskByBadge, function(groupTask, key){
            //     groupTask = $filter('orderBy')(groupTask, '-Created');
            //     if(badge.Id == groupTask[0].BadgeId && badge.XP == getSum(groupTask)){
            //         badge.Created = groupTask[0].Created;
            //         ctrl.allBadges.push(badge);
            //     }
            // });
        });
        setTimeout(function(){
            $('[data-toggle="tooltip"]').tooltip();   
        },500);
    });

    function getSum(arr){
        var sum = 0;
        angular.forEach(arr, function(item, key){
            sum += item.XP;
        });
        return sum;
    }
    function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
}