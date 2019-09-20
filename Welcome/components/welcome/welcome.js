

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
    var ctrl = this;
    ctrl.userInfo = ctrl.user;
    ctrl.allTasks = [];
    ctrl.allUserTasks = [];
    ctrl.allTasksLog = [];
    ctrl.groupedTasks = [];
    var recentTasks = [];
    ctrl.recentTasks = [];
    ctrl.allAvatars = [];
    var allBadges = [];
    ctrl.allCampaigns = [];
    ctrl.moment = moment;
    ctrl.colorArr = ['#5cb85c', '#07b16a', '#33cddd', '#245698', '#79569c'];

    
    ctrl.openPropModal = function(){
        $('#propeties-form').modal('show');
    };

    $WelcomeService.getTaskItems().then(function(res) {
        ctrl.allTasks = res;
        ctrl.groupedTasks = createChunksFromArray(ctrl.allUserTasks, 5);
    });

    var requests = {
        allCampaigns: $WelcomeService.getAllWebs(),
        allAvatars: $WelcomeService.getAvatarsItems(),
        allBadges: $WelcomeService.getBadgesItems("$select=*,Previous/Title,Previous/Id&$expand=Previous"),
        allUserTasks: $WelcomeService.getTaskItems("$filter=BadgeType eq 'User'"),
        allTasks: $WelcomeService.getTaskItems(),
        allTasksLog: $WelcomeService.getTaskLogItems('$filter=AssignedToId eq '+_spPageContextInfo.userId),
        userProfile: $WelcomeService.getUserProfile(),
        recentTasks: $WelcomeService.getTaskLogItems('$top=20&$orderby=Created desc&$select=*,Badge/Id,Badge/Title,AssignedTo/Title,AssignedTo/EMail,AssignedTo/Id,Author/Id,Author/Title&$expand=Badge,AssignedTo,Author'),
    };

    $q.all(requests).then(function(data){
        ctrl.allCampaigns = data.allCampaigns.value;
        ctrl.allAvatars = data.allAvatars;
        allBadges = data.allBadges;
        ctrl.allTasks = data.allTasks;
        ctrl.allUserTasks = data.allUserTasks;
        ctrl.groupedTasks = createChunksFromArray(setTasksOrder(ctrl.allUserTasks), 5);
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
            if(prop.Key == "Manager"){
                ctrl.userInfo.managerLogName = prop.Value || '';
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
                ctrl.userInfo.userRole = user.UserRole;
                
            }
            else {
                $WelcomeService.getSPUser(ctrl.userInfo.managerLogName).then(function(res){
                    var newItem = { 
                        Title : ctrl.userInfo.fullName,
                        UserId: _spPageContextInfo.userId,
                        Department: ctrl.userInfo.department,
                        Position: ctrl.userInfo.position,
                        Credits: 100,
                        XP: 0,
                        __metadata:  {type: 'SP.Data.UsersLogListItem' }
                    };
                    if(res.length == 1){
                        newItem['ManagerId'] = res[0].Id;
                        newItem['UserRole'] = 'User';
                    }
                    $WelcomeService.createUserLogItem(newItem).then(function(item){
                        var user = item;
                        ctrl.userInfo.credits = user.Credits || 0;
                        ctrl.userInfo.xp = user.XP || 0;
                        ctrl.userInfo.userItemId = user.Id;
                        ctrl.userInfo.avatar = user.Avatar;
                        ctrl.userInfo.avatarItem = user.AvatarItem;
                        ctrl.userInfo.userRole = user.UserRole;
                        
                    });
                });
            }

            if(ctrl.userInfo.userRole == 'Manager'){
                $('#navbarSupportedContent>.nav').append('<li><a href="Manager.aspx">Manager Page</a></li>');
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
                            // var avatarItem = await $WelcomeService.getUserLogItemByUserId(badge['TaskLog'].AssignedToId);
                            // badge['AvatarItem'] = avatarItem[0].Avatar;
                            ctrl.recentTasks.push(badge);
                        }
                    }
                    else {
                        // var avatarItem = await $WelcomeService.getUserLogItemByUserId(recentTasks[key].AssignedToId);
                        // recentTasks[key].AvatarItem = avatarItem[0].Avatar;
                        ctrl.recentTasks.push(recentTasks[key]); 
                    }
                }
            });
            var avatarsReq = {};
            angular.forEach(ctrl.recentTasks, function(task, key){
                if(task['odata.type'] == 'SP.Data.BadgesListListItem' || task['odata.type'] == 'SP.Data.BadgesListItem'){
                    avatarsReq[key] = $WelcomeService.getUserLogItemByUserId(task['TaskLog'].AssignedToId);
                }
                else if(task['odata.type'] == 'SP.Data.BadgesTaskLogListItem'){
                    avatarsReq[key] = $WelcomeService.getUserLogItemByUserId(task.AssignedToId);
                }
                
            });
            $q.all(avatarsReq).then(function(res){
                angular.forEach(ctrl.recentTasks, function(task, key){
                    task.AvatarItem = (res[key].length && res[key][0].Avatar) ? res[key][0].Avatar : {Url: '/_layouts/15/userphoto.aspx?size=S&username=EMail'};
                });
            });
        });
    });

    ctrl.getAvatarUrlById =  function(userId){
        var url = "/_layouts/15/userphoto.aspx?size=S&username=email";
        // var item = await $WelcomeService.getUserLogItemByUserId(userId);
        // angular.forEach(ctrl.allAvatars, function(avatar, i){
        //     if(avatar.Id == itemId){
        //         url = avatar.Avatar.Url;
        //     }
        // });
        // if(item.Avatar){
        //     url = item.Avatar.Url;
        // }
        return url;
    };

    function setBadgesOrder(){
        var orderedBadges = [];
        var allUserBadges = allBadges.filter(function(item){return item.BadgeType == 'User';});
        angular.forEach(allUserBadges, function(badge, k){
            if(!badge.PreviousId){
                orderedBadges.push(badge);
            }
        });
        for(var i=0;i<allUserBadges.length;i++){
            angular.forEach(allUserBadges, function(badge, k){
                if(orderedBadges[orderedBadges.length-1].Id == badge.PreviousId){
                    orderedBadges.push(badge);
                }
            });
        }
        return orderedBadges;
    }

    function setTasksOrder(tasks){
        var orderedBadges = setBadgesOrder();
        var orderedTasks = [];        
        angular.forEach(orderedBadges, function(badge, k){
            angular.forEach(badge.Tasks, function(task, key){
                angular.forEach(tasks, function(item, i){
                    if(item.Id == task.Id){
                        orderedTasks.push(item);
                    }
                    
                });
            });
        });
        return orderedTasks;
    }

    function checkIfItemExist(badge){
        var isExist = false;
        angular.forEach(ctrl.recentTasks, function(item, key){
            if((item['odata.type'] == "SP.Data.BadgesListListItem" || item['odata.type'] == "SP.Data.BadgesListItem") && 
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
        if(!ctrl.checkIsAllowedTask(task.BadgeId)) return;
        if(ctrl.checkTask(task.Title, task.BadgeId)) return;
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
        angular.forEach(ctrl.allUserTasks, function(task, key){
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

    ctrl.checkIsAllowedTask = function(badgeId){
        var flag = false;
        var badge = allBadges.filter(function(x){
            return x.Id == badgeId;
        })[0];
        if(!badge.PreviousId){
            flag = true;
        }
        else {
            var grupedTaskByBadge = groupBy(ctrl.allTasksLog, 'BadgeId');
            var grupedTasksItemsByBadge = groupBy(ctrl.allTasks, 'BadgeId');
            if(grupedTaskByBadge[badge.PreviousId] && grupedTaskByBadge[badge.PreviousId].length == grupedTasksItemsByBadge[badge.PreviousId].length){
                flag = true;
            }
        }
        return flag;
    };

    function createChunksFromArray(array, chankLength){
        var temparray = [];
        var i,j;
        for (i=0,j=array.length; i<j; i+=chankLength) {
            temparray.push(array.slice(i,i+chankLength));
        }
        angular.forEach(temparray, function(value,k){
            if(value.length < 5){
                var emptyLength = 5-value.length;
                for(var i=0;i<emptyLength;i++){
                    value.push({isEmpty: true});
                }
            }
        });
        return temparray;
    }

    function groupBy(xs, prop) {
        return xs.reduce(function(rv, x) {
          (rv[x[prop]] = rv[x[prop]] || []).push(x);
          return rv;
        }, {});
    }
}