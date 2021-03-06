
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
    /*var requests = {
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
        });
        setTimeout(function(){
            $('[data-toggle="tooltip"]').tooltip();   
        },500);
    });*/
	
	$DashboardService.getAllWebs().then(function(res){
		var allBadgesReq = [];
		var allTaskReq = [];
		var tasksListItemsReq = [];
		angular.forEach(res.value, function(val){
			allBadgesReq.push($DashboardService.getBadgesItems(undefined, val.ServerRelativeUrl));
			allTaskReq.push($DashboardService.getTaskItems(undefined, val.ServerRelativeUrl));
			tasksListItemsReq.push($DashboardService.getTaskListItems(undefined, val.ServerRelativeUrl));
		});
		var req = {
			allBadges: $q.all(allBadgesReq),
			allTask: $q.all(allTaskReq),
			tasksListItems: $q.all(tasksListItemsReq)
		};
		$q.all(req).then(function(res){
			var grupedTaskByBadge = [];
			angular.forEach(res.allTask, function(val, k){
				grupedTaskByBadge[k] = groupBy(val, 'BadgeId');
			});
			var grupedTasksItemsByBadge = [];
			angular.forEach(res.tasksListItems, function(val, k){
				grupedTasksItemsByBadge[k] = groupBy(val, 'BadgeId');
			});
			angular.forEach(res.allBadges, function(badgeGroup, key){
				angular.forEach(badgeGroup, function(badge, k){
					if(grupedTaskByBadge[key][badge.Id] && grupedTaskByBadge[key][badge.Id].length == grupedTasksItemsByBadge[key][badge.Id].length){
						groupTask = $filter('orderBy')(grupedTaskByBadge[key][badge.Id], '-Created');
						badge.Created = groupTask[0].Created;
						ctrl.allBadges.push(badge);
					}
				});
			});
			ctrl.allBadges = $filter('orderBy')(ctrl.allBadges, '-Created');
			setTimeout(function(){
				$('[data-toggle="tooltip"]').tooltip();   
			},500);
		});
		
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