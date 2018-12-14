angular.module('BadgesApp')
    .component('badgeInfo', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Badges/components/badge-info/badge-info.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$BadgesService', '$sce', badgeInfoCtrl]
    });

function badgeInfoCtrl($BadgesService, $sce){
    var ctrl = this;
    ctrl.userInfo = {};
    ctrl.allBadges = [];
    ctrl.allTask = [];
    $BadgesService.getBadgesItems().then(function(res){
        ctrl.allBadges = res;
    });
    updateData();
    

    ctrl.createTaskItem = function(taskName, badgeId){
        var taskWeight = 50;
        var item = {
            Title: taskName,
            Badge: badgeId,
            AssignedTo: _spPageContextInfo.userId,
            XP: taskWeight
        };
        $BadgesService.createTaskItem(item).then(function(res){
            var userItem = {
                Id: ctrl.userInfo.userItemId,
                XP: ctrl.userInfo.xp + taskWeight
            };
            $BadgesService.updateUserLogItem(userItem).then(function(res){
                updateData();
            }); 
        });
    }

    ctrl.checkTask = function(taskName, badgeId){
        var flag = false;
        angular.forEach(ctrl.allTask,function(task, key){
            if(task.Title == taskName && task.BadgeId == badgeId){
                flag = true;
            }
        });
        return flag;
    }

    ctrl.showToast = function(id) {
        var x = document.getElementById(id);
        x.className = "show snackbar";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    function updateData(){
        $BadgesService.getTaskItems().then(function(res){
            ctrl.allTask = res;
        });
        $BadgesService.getUserProfile().then(function(data){
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

    ctrl.trustHtml = function(html) {
        return $sce.trustAsHtml(html);
    }
}