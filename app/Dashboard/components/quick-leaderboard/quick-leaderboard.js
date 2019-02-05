angular.module('DashboardApp')
    .component('quickLeaderboard', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Dashboard/components/quick-leaderboard/quick-leaderboard.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$DashboardService', quickLeaderboardCtrl]
    });

function quickLeaderboardCtrl($DashboardService){
    var ctrl = this;
	ctrl.userInfo = {};
    ctrl.allBadges = [];
    ctrl.leaderboardByRole = [];
    ctrl.userLogItemsByDept = [];
    getAllUsers();
    $DashboardService.getBadgesItems().then(function(res){
        ctrl.allBadges = res;
    });
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
                ctrl.userInfo.role = user.Role || '';
                getUserByRole(ctrl.userInfo.role);
            }
        });
    });

    ctrl.getSumOfXP = function(arr){
        var sum = 0;
        arr = arr || [];
        angular.forEach(arr, function(item, key){
            sum += item.XP;
        });
        return sum;
    };

    function getUserByRole(role){
        var filter = 'Role eq \''+role+'\'';
        $DashboardService.getUserLogItems(filter).then(function(data){
            ctrl.leaderboardByRole = data;
        });
    }

    function getAllUsers(){
        var filter = '';
        $DashboardService.getUserLogItems(filter).then(function(data){
            let tmpArr = groupBy(data, 'Department');
            angular.forEach(tmpArr, function(value, key){
                ctrl.userLogItemsByDept.push({
                    title: key,
                    xp: ctrl.getSumOfXP(value)
                });
            });
        });
    }

    function groupBy(xs, prop) {
        return xs.reduce(function(rv, x) {
          (rv[x[prop]] = rv[x[prop]] || []).push(x);
          return rv;
        }, {});
    }
}