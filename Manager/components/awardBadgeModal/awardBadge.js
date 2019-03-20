angular.module('ManagerApp')
    .component('awardBadge', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Manager/components/awardBadgeModal/awardBadge.html?rnd' + Math.random(),
        bindings: {
            badges: '=',
            allTasksLog: '=',
            userInfo: '=',
            update: '='
        },
        controllerAs: 'ctrl',
        controller: ['$ManagerService', '$sce', '$q', '$PopUpMsg', '$scope', awardBadgeCtrl]
    });
    function awardBadgeCtrl($ManagerService, $sce, $q, $PopUpMsg, $scope){
        var ctrl = this;
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
            angular.forEach(ctrl.allTasksLog,function(task, key){
                if(task.Title == taskName && task.BadgeId == badgeId){
                    flag = true;
                }
            });
            return flag;
        }
        
        ctrl.trustHtml = function(html) {
            html = html ? html.replace(/ style=("|\')(.*?)("|\')/, '') : '';
            return $sce.trustAsHtml(html);
        };

        ctrl.createTaskItem = function($event, task){
            var item = {
                Title: task.Title,
                Badge: task.BadgeId,
                AssignedTo: ctrl.userInfo.userId,
                XP: task.XP,
                Task: task.Id
            };
            var userItem = {
                Id: ctrl.userInfo.userItemId,
                XP: ctrl.userInfo.xp + task.XP
            };
            var req = {
                createTaskItem: $ManagerService.createTaskItem(item),
                updateUserLogItem: $ManagerService.updateUserLogItem(userItem)
            };
            $q.all(req).then(function(res){
                var el = $event.target.parentElement.parentElement;
                var newTable = angular.element('<div><table class="table table-bordered"></table></div>');
                newTable.find('table').append(angular.copy(el));
                newTable.find('tr').attr('data-original-title', '');
                newTable.find('tr').attr('title', '');
                newTable.find('button').parent().remove();
                
    
                $PopUpMsg.show({
                    title: 'Add new badge!', 
                    body: newTable.html()
                });
                ctrl.update += 1;
            });
            
        };

        ctrl.showToast = function(task) {
            var x = document.getElementById('task-toast');
            x.innerText = "+" + task.XP + " XP";
            x.className = "show snackbar";
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        };
    }