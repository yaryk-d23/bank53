angular.module('BadgesApp')
    .component('badgeInfo', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Badges/components/badge-info/badge-info.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$BadgesService', '$GeneratePDF', '$sce', '$q' , '$PopUpMsg', badgeInfoCtrl]
    });

function badgeInfoCtrl($BadgesService, $GeneratePDF, $sce, $q, $PopUpMsg){
    var ctrl = this;
    ctrl.userInfo = {};
    ctrl.allBadges = [];
    ctrl.allTask = [];
    

    var urlTaskId = getParameterByName('task');

    updateData();
    ctrl.generatePdf = function($event, task) {
		if(task.LinkedSource){
			window.open(task.LinkedSource.Url, '_blank');
			return;
		}
		else {
            $GeneratePDF.generatePDF($event, task);
        }

    };

    ctrl.createTaskItem = function(task){
        var item = {
            Title: task.Title,
            Badge: task.BadgeId,
            AssignedTo: _spPageContextInfo.userId,
            XP: task.XP,
            Task: task.Id
        };
        $BadgesService.createTaskItem(item).then(function(res){
            var userItem = {
                Id: ctrl.userInfo.userItemId,
                XP: ctrl.userInfo.xp + task.XP
            };
            var requests = {
                allBadges: $BadgesService.getBadgesItems('$filter=Id eq '+task.BadgeId),
                allTask: $BadgesService.getTaskLogItems('$filter=BadgeId eq '+task.BadgeId+' and AssignedToId eq '+_spPageContextInfo.userId),
                tasksListItems: $BadgesService.getTaskItems('$filter=BadgeId eq '+task.BadgeId),
                updateUserLogItem: $BadgesService.updateUserLogItem(userItem),
            };
            $q.all(requests).then(function(res){
                updateData();
                ctrl.showToast(task);

                var grupedTaskByBadge = groupBy(res.allTask, 'BadgeId');
                var grupedTasksItemsByBadge = groupBy(res.tasksListItems, 'BadgeId');
                var badge = res.allBadges[0];
                if(grupedTaskByBadge[badge.Id] && grupedTaskByBadge[badge.Id].length == grupedTasksItemsByBadge[badge.Id].length){
                    $PopUpMsg.show({
                        title: '<div>' + task.Title + ' Completed<br/>You Achived a new Badge</div>', 
                        body: getBadgeHtml(task, badge)
                    });
                }
                else {
                    $PopUpMsg.show({
                        title: '<div>' + task.Title + ' Completed</div>',  
                        body: getBadgeHtml(task)
                    });
                }
            });

            // $BadgesService.updateUserLogItem(userItem).then(function(res){
            //     updateData();
            //     ctrl.showToast(task);
            //     $PopUpMsg.show({
            //         title: task.Title + ' completed!', 
            //         body: getBadgeHtml(task)
            //     });
            // }); 
        });
    };
    
    function getBadgeHtml(task, badge){
        var badgeHtml = '';
        if(badge){
            badgeHtml = '<div class="text-center">'+
                        '<div><h4>'+task.Title+' +'+task.XP+'XP</h4></div>'+
                        '<img class="img-circle" src="'+badge.Icon.Url+'"/>'+
                        '<div>'+badge.Title+'</div>'+
                        '</div>';
        }
        else {
            badgeHtml = '<div class="text-center">'+
                        '<div><div><h4>'+task.Title+'</h4></div><div>+'+task.XP+'XP</div></div>'+
                        '</div>';
        }
        return badgeHtml;
    }

    ctrl.getBadgeXP = function(tasks){
        var xp = 0;
        if(tasks && tasks.length)  {
            angular.forEach(tasks, function(item, k){
                xp += item.XP;
            });
        }
        return xp;
    };

    ctrl.checkTask = function(taskName, badgeId){
        var flag = false;
        angular.forEach(ctrl.allTask,function(task, key){
            if(task.Title == taskName && task.BadgeId == badgeId){
                flag = true;
            }
        });
        return flag;
    }

    ctrl.showToast = function(task) {
        var x = document.getElementById('task-toast');
        x.innerText = "+" + task.XP + " XP";
        x.className = "show snackbar";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    function updateData(){
		try{
        var requestData = {
            taskLogItems: $BadgesService.getTaskLogItems('$filter=AssignedToId eq '+_spPageContextInfo.userId),
            userProfile: $BadgesService.getUserProfile(),
			allBadges: $BadgesService.getBadgesItems("$filter=BadgeType eq 'User'")
        };
        $q.all(requestData).then(function(res){
			//alert('work');
            ctrl.allTask = res.taskLogItems;
            ctrl.allBadges = res.allBadges;

            //add task if id is exist
            if(urlTaskId) {
                $BadgesService.getTaskLogItems('$filter=Task/Id eq '+urlTaskId).then(function(taskRes){
                    if(!taskRes.length) {
                        $BadgesService.getTaskItems('$filter=Id eq '+urlTaskId).then(function (res){
                            //ExecuteOrDelayUntilScriptLoaded(function(){
                                ctrl.createTaskItem(res[0]);
                            //}, "SP.js");
                        });
                    }
                    else{
                        window.history.pushState(null,null,'?');
                    }
                });
            }

            //set user info
            var data = res.userProfile;
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
            $BadgesService.getUserLogItem(ctrl.userInfo.userName).then(function(data){
                if(data.length) {
                    var user = data[0];
                    ctrl.userInfo.credits = user.Credits || 0;
                    ctrl.userInfo.xp = user.XP || 0;
                    ctrl.userInfo.userItemId = user.Id;
                }
            });
        });
		}
		catch(e){
			alert(e);
		}
    }

    ctrl.trustHtml = function(html) {
        return $sce.trustAsHtml(html);
    };

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return parseInt(decodeURIComponent(results[2].replace(/\+/g, " ")), 10);
    }

    function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
    }
    var getStyle= function(startY,haveHeader,drawHeaderRow, drawCell, drawRow, customHeader){
        var result ={
            margin: {
                        top: 40,
                        left: 40,
                        right: 40,
                        bottom: 40
                    },
            bodyStyles: {
                        textColor: [103, 103, 103],
                        lineColor:[199,217,229],
                        cellPadding: 10,
                        //rowHeight: 30,
                     },
            alternateRowStyles: { 
                        fillColor: [238, 240, 246],
                        lineWidth: 1,
                        lineColor:[199,217,229],
                      },
            styles: {
                        fontSize: 10,
                        valign: 'top',
                        lineWidth: 1,
                        lineColor:[199,217,229],
                        overflow: 'linebreak'
                     },
            pageBreak: 'avoid',
            startY:startY + 30,
            columnStyles: {
                Title: {columnWidth: 150},
                Time: {columnWidth: 100},
                Solicitation: {columnWidth: 100},
                Status: {columnWidth: 120}
            }
            
        }
        if(drawHeaderRow)
            result.drawHeaderRow=drawHeaderRow; 
        if(drawCell)
            result.drawCell = drawCell;
        if(drawRow)
            result.drawRow = drawRow;
        if(haveHeader && !customHeader)
            result.headerStyles= {
                    cellPadding: 8,
                    //rowHeight: 30,
                    lineColor: [199,217,229],
                    halign: 'left',
                    valign: 'middle',
                    overflow: 'visible',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fillColor:[222, 242, 255],
                    textColor: [68,68,68]
                 }
         else if(customHeader)
             result.headerStyles = customHeader;
         //else
        //    result.headerStyles={rowHeight:0};
        
        return result;
    
    };
}