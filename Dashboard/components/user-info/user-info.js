angular.module('DashboardApp')
    .component('userInfo', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Dashboard/components/user-info/user-info.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$DashboardService', userInfoCtrl]
    });

function userInfoCtrl($DashboardService){
    var ctrl = this;
    ctrl.userInfo = {};
    ctrl.allBadges = [];
    $DashboardService.getBadgesItems().then(function(res){
        ctrl.allBadges = res;
        setTimeout(function(){
            $('[data-toggle="tooltip"]').tooltip();   
        },500);

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
            }
        });
    });

}