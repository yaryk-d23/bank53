angular.module('DashboardApp')
    .component('userInfo', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Dashboard/components/user-info/user-info.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$DashboardService', '$q', userInfoCtrl]
    });

function userInfoCtrl($DashboardService, $q){
    var ctrl = this;
    ctrl.userInfo = {};
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
                ctrl.allBadges.push(badge);
            }
            // angular.forEach(grupedTaskByBadge, function(groupTask, key){
            //     if(badge.Id == groupTask[0].BadgeId && badge.XP == getSum(groupTask)){
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

    // $DashboardService.getBadgesItems().then(function(res){
    //     ctrl.allBadges = res;
    //     setTimeout(function(){
    //         $('[data-toggle="tooltip"]').tooltip();   
    //     },500);

    // });
    $DashboardService.getUserProfile().then(function(data){
        angular.forEach(data.UserProfileProperties, function(prop, key){
            if(prop.Key == "PictureURL"){
                ctrl.userInfo.pictureUrl = prop.Value;
            }
            if(prop.Key == "UserName"){
                ctrl.userInfo.userName = prop.Value;
            }
            if(prop.Key == "Department"){
                ctrl.userInfo.department = prop.Value || '';
            }
            if(prop.Key == "Title"){
                ctrl.userInfo.position = prop.Value || '';
            }
        });
        ctrl.userInfo.fullName = data.DisplayName;
        $DashboardService.getUserLogItem(ctrl.userInfo.userName).then(function(data){
            if(data.length) {
                var user = data[0];
                ctrl.userInfo.credits = user.Credits || 0;
                ctrl.userInfo.xp = user.XP || 0;
                ctrl.userInfo.userItemId = user.Id;
            }
        });
    });

    function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

}