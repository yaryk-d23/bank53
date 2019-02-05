angular.module('LeaderboardApp')
    .component('leaderboardTable', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Leaderboard/components/leaderboard-table/leaderboard-table.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$LeaderboardService', '$sce', '$q', leaderboardTableCtrl]
    });

function leaderboardTableCtrl($LeaderboardService, $sce, $q){
    var ctrl = this;
    ctrl.groupBy = ['Role', 'Department'];
    ctrl.groupByValue = ctrl.groupBy[0];
    ctrl.userLogItems = [];
    ctrl.userLogItemsByDept = [];
    ctrl.userInfo = {};
    $LeaderboardService.getUserLogItems().then(function(data){
        ctrl.userLogItems = data;
        ctrl.userLogItemsByDept = groupBy(ctrl.userLogItems, 'Department');
    });
    $LeaderboardService.getUserProfile().then(function(data){
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
        $LeaderboardService.getUserLogItems('User/UserName eq \'' + ctrl.userInfo.userName +'\'').then(function(data){
            if(data.length) {
                var user = data[0];
                ctrl.userInfo.credits = user.Credits || 0;
                ctrl.userInfo.xp = user.XP || 0;
                ctrl.userInfo.userItemId = user.Id;
                ctrl.userInfo.role = user.Role || '';
                ctrl.userInfo.department = user.Department || '';
                ctrl.userInfo.region = user.Region || '';
            }
        });
    });

    ctrl.filterData = function() {
        var filteredItems = [];
        if(ctrl.groupByValue == 'Role'){
            angular.forEach(ctrl.userLogItems, function(item, key){
                if(item.Role == ctrl.userInfo.role){
                    filteredItems.push(item);
                }
            });
        }
        else if(ctrl.groupByValue == 'Department'){
            filteredItems = ctrl.userLogItemsByDept;
        }
        // else if(ctrl.groupByValue == 'Region'){

        // }
        console.log(filteredItems);
        return filteredItems;
    };

    ctrl.getSumOfXP = function(arr){
        var sum = 0;
        arr = arr || [];
        angular.forEach(arr, function(item, key){
            sum += item.XP;
        });
        return sum;
    };

    function groupBy(xs, prop) {
        return xs.reduce(function(rv, x) {
          (rv[x[prop]] = rv[x[prop]] || []).push(x);
          return rv;
        }, {});
    }
    ctrl.loadData = function() {

        console.log(ctrl.groupByValue);
    };
}