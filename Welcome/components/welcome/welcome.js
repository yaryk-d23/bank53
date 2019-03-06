

angular.module('WelcomeApp')
    .component('welcome', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Welcome/components/welcome/welcome.html?rnd' + Math.random(),
        bindings: {
            user: '='
        },
        controllerAs: 'ctrl',
        controller: ['$WelcomeService', '$GeneratePDF', '$sce', '$q', welcomeCtrl]
    });

function welcomeCtrl($WelcomeService, $GeneratePDF, $sce, $q){
	try{
    var ctrl = this;
    ctrl.userInfo = ctrl.user;
    ctrl.allTasks = [];
    ctrl.allTasksLog = [];
    ctrl.groupedTasks = [];
    var recentTasks = [];
    ctrl.recentTasks = [];
    var allBadges = [];
    ctrl.moment = moment;
    ctrl.colorArr = ['#5cb85c', '#07b16a', '#33cddd', '#245698', '#79569c'];

    
    ctrl.openPropModal = function(){
        $('#propeties-form').modal('show');
    };

    $WelcomeService.getTaskItems().then(function(res) {
        ctrl.allTasks = res;
        ctrl.groupedTasks = createChunksFromArra(ctrl.allTasks, 5);
    });

    var requests = {
        allBadges: $WelcomeService.getBadgesItems(),
        allTasks: $WelcomeService.getTaskItems(),
        allTasksLog: $WelcomeService.getTaskLogItems('$filter=AssignedToId eq '+_spPageContextInfo.userId),
        userProfile: $WelcomeService.getUserProfile(),
        recentTasks: $WelcomeService.getTaskLogItems('$top=20&$orderby=Created desc&$select=*,Badge/Id,Badge/Title,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id&$expand=Badge,AssignedTo'),
    };

    $q.all(requests).then(function(data){
        allBadges = data.allBadges;
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
                ctrl.userInfo.avatar = user.Avatar;
                ctrl.userInfo.avatarItem = user.AvatarItem;
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
                    ctrl.userInfo.avatar = user.Avatar;
                    ctrl.userInfo.avatarItem = user.AvatarItem;
                });
            }
        });
        var groupedTasksByBadge = groupBy(ctrl.allTasks, 'BadgeId');
        recentTasks = data.recentTasks;
        var recentActRequests = {};
        for(var i=0;i<recentTasks.length;i++){
            recentActRequests[i] = $WelcomeService.getTaskLogItems('$filter=BadgeId eq '+recentTasks[i].BadgeId+'&$select=*,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id&$expand=AssignedTo');
        }
		
        $q.all(recentActRequests).then(function(res){
            angular.forEach(res, function(req, key){
                if(ctrl.recentTasks.length < 3){
                    if(getSumOfXP(req) == getSumOfXP(groupedTasksByBadge[recentTasks[key].BadgeId])){
                        var badge = allBadges.filter(function(x){
                            return x.Id == recentTasks[key].BadgeId;
                        })[0];
                        badge['TaskLog'] = recentTasks[key];
                        if(!checkIfItemExist(badge)){
                            ctrl.recentTasks.push(badge);
                        }
                    }
                    else {
                        ctrl.recentTasks.push(recentTasks[key]); 
                    }
                }
            });
        });
        // for(var i=0;i<recentTasks.length;i++){
        //     if(ctrl.recentTasks.length < 3){
        //         let req = await $WelcomeService.getTaskLogItems('$filter=BadgeId eq '+recentTasks[i].BadgeId+'&$select=*,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id&$expand=AssignedTo');
        //         if(getSumOfXP(req) == getSumOfXP(groupedTasksByBadge[recentTasks[i].BadgeId])){
        //             let badge = await $WelcomeService.getBadgesItems('$filter=Id eq '+recentTasks[i].BadgeId);
        //             badge[0]['TaskLog'] = recentTasks[i];
        //             if(!checkIfItemExist(badge[0])){
        //                 ctrl.recentTasks.push(badge[0]);
        //             }
        //         }
        //         else {
        //             ctrl.recentTasks.push(recentTasks[i]); 
        //         }
        //     }
        // }
    });
		}
		catch(e){alert(e);}

    function checkIfItemExist(badge){
        var isExist = false;
        angular.forEach(ctrl.recentTasks, function(item, key){
            if(item['odata.type'] == "SP.Data.BadgesListListItem" && 
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
    ctrl.getLastCompletedTask = function(){
        var taskId = 0;
        angular.forEach(ctrl.allTasks, function(task, key){
            if(ctrl.checkTask(task.Title, task.BadgeId)){
                taskId = task.Id;
            }
        });
        return taskId;
    };

    ctrl.checkTask = function(taskName, badgeId){
        var flag = false;
        angular.forEach(ctrl.allTasksLog,function(task, key){
            if(task.Title == taskName && task.BadgeId == badgeId){
                flag = true;
            }
        });
        return flag;
    };

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