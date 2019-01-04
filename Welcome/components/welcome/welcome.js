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
    $WelcomeService.getUserProfile().then(function(data){
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
        $WelcomeService.getUserLogItem(ctrl.userInfo.userName).then(function(data){
            if(data.length) {
                var user = data[0];
                ctrl.userInfo.credits = user.Credits || 0;
                ctrl.userInfo.xp = user.XP || 0;
                ctrl.userInfo.userItemId = user.Id;
            }
        });
    });
}