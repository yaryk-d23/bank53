'use strict'

angular.module('WelcomeApp')
    .component('welcome', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Welcome/components/welcome/welcome.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$WelcomeService', '$GeneratePDF', '$sce', '$q', welcomeCtrl]
    });

function welcomeCtrl($WelcomeService, $GeneratePDF, $sce, $q){
    var ctrl = this;
    ctrl.userInfo = {};
    ctrl.allTasks = [];
    ctrl.allTasksLog = [];
    ctrl.groupedTasks = [];
    var recentTasks = [];
    ctrl.recentTasks = [];
    ctrl.colorArr = ['#5cb85c', '#07b16a', '#33cddd', '#245698', '#79569c'];
    $WelcomeService.getTaskItems().then(function(res) {
        ctrl.allTasks = res;
        ctrl.groupedTasks = createChunksFromArra(ctrl.allTasks, 5);
    });

    var requests = {
        allTasks: $WelcomeService.getTaskItems(),
        allTasksLog: $WelcomeService.getTaskLogItems('$filter=AssignedToId eq '+_spPageContextInfo.userId),
        userProfile: $WelcomeService.getUserProfile(),
        recentTasks: $WelcomeService.getTaskLogItems('$top=20&$orderby=Created desc&$select=*,Badge/Id,Badge/Title,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id&$expand=Badge,AssignedTo'),
    };

    $q.all(requests).then(async function(data){
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
        var groupedTasksByBadge = groupBy(ctrl.allTasks, 'BadgeId');
        recentTasks = data.recentTasks;
        for(var i=0;i<recentTasks.length;i++){
            if(ctrl.recentTasks.length < 4){
                let req = await $WelcomeService.getTaskLogItems('$filter=BadgeId eq '+recentTasks[i].BadgeId+'&$select=*,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id&$expand=AssignedTo');
                if(getSumOfXP(req) == getSumOfXP(groupedTasksByBadge[recentTasks[i].BadgeId])){
                    let badge = await $WelcomeService.getBadgesItems('$filter=Id eq '+recentTasks[i].BadgeId);
                    badge[0]['TaskLog'] = recentTasks[i];
                    if(!checkIfItemExist(badge[0])){
                        ctrl.recentTasks.push(badge[0]);
                    }
                }
                else {
                    ctrl.recentTasks.push(recentTasks[i]); 
                }
            }
        }
    });

    function checkIfItemExist(badge){
        var isExist = false;
        angular.forEach(ctrl.recentTasks, function(item, key){
            if(item['odata.type'] == "SP.Data.BadgesListItem" && 
                item.Id == badge.Id && 
                badge['TaskLog'].AssignedToId ==  item['TaskLog'].AssignedToId){
                    isExist = true;
                }
        });
        return isExist;
    }

    function getSumOfXP(arr){
        var sum = 0;
        arr = arr || [];
        angular.forEach(arr, function(item, key){
            sum += item.XP;
        });
        return sum;
    }

    ctrl.generatePdf = function($event, task) {
		if(task.LinkedSource){
			window.open(task.LinkedSource.Url, '_blank');
			return;
		}
		else {
            $WelcomeService.getBadgeIcon(task.BadgeId).then(function(icon){
                var myImage = new Image();
                myImage.src = icon.Url;
                myImage.onload = function(){
                    $GeneratePDF.generatePDF($event, task, myImage);
                };
            });
        }

    };

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