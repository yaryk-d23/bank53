angular.module('WelcomeApp')
    .component('welcome', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Welcome/components/welcome/welcome.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$WelcomeService', '$sce', '$q', welcomeCtrl]
    });

function welcomeCtrl($WelcomeService, $sce, $q){
    var ctrl = this;
    ctrl.userInfo = {};
    ctrl.allTasks = [];
    ctrl.allTasksLog = [];
    ctrl.groupedTasks = [];
    ctrl.colorArr = ['#5cb85c', '#07b16a', '#33cddd', '#245698', '#79569c'];
    $WelcomeService.getTaskItems().then(function(res) {
        ctrl.allTasks = res;
        ctrl.groupedTasks = createChunksFromArra(ctrl.allTasks, 5);
        console.log(ctrl.groupedTasks);
    });

    var requests = {
        allTasks: $WelcomeService.getTaskItems(),
        allTasksLog: $WelcomeService.getTaskLogItems('$filter=AssignedToId eq '+_spPageContextInfo.userId),
        userProfile: $WelcomeService.getUserProfile()
    };

    $q.all(requests).then(function(data){
        ctrl.allTasks = data.allTasks;
        ctrl.groupedTasks = createChunksFromArra(ctrl.allTasks, 5);
        ctrl.allTasksLog = data.allTasksLog;
        angular.forEach(data.userProfile.UserProfileProperties, function(prop, key){
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
        ctrl.userInfo.fullName = data.userProfile.DisplayName;
        $WelcomeService.getUserLogItem(ctrl.userInfo.userName).then(function(res){
            if(res.length) {
                var user = res[0];
                ctrl.userInfo.credits = user.Credits || 0;
                ctrl.userInfo.xp = user.XP || 0;
                ctrl.userInfo.userItemId = user.Id;
            }
            else {
                var newItem = { 
                    Title : ctrl.userInfo.fullName,
                    UserId: _spPageContextInfo.userId,
                    Credits: 100,
                    XP: 0,
                    __metadata:  {type: 'SP.Data.UsersLogListItem' }
                };
                $WelcomeService.createUserLogItem(newItem).then(function(item){
                    var user = item;
                    ctrl.userInfo.credits = user.Credits || 0;
                    ctrl.userInfo.xp = user.XP || 0;
                    ctrl.userInfo.userItemId = user.Id;
                });
            }
        });
    });

    ctrl.checkTask = function(taskName, badgeId){
        var flag = false;
        angular.forEach(ctrl.allTasksLog,function(task, key){
            if(task.Title == taskName && task.BadgeId == badgeId){
                flag = true;
            }
        });
        return flag;
    }

    function createChunksFromArra(array, chankLength){
        var temparray = [];
        var i,j;
        for (i=0,j=array.length; i<j; i+=chankLength) {
            temparray.push(array.slice(i,i+chankLength));
        }
        return temparray;
    }

    function groupBy(xs, prop) {
        return xs.reduce(function(rv, x) {
          (rv[x[prop]] = rv[x[prop]] || []).push(x);
          return rv;
        }, {});
    }
}