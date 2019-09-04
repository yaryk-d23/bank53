(function(){
    angular.module('WelcomeApp', [
        //'ngSanitize'
    ])

    .controller('AppCtrl', ['$WelcomeService', function($WelcomeService) {
        var ctrl = this;
        ctrl.userInfo = {};
        $WelcomeService.getPermissionListItem('$filter=UserId eq '+_spPageContextInfo.userId).then(function(res){
            var addLink = false;
            angular.forEach(res, function(i, key){
                if(i.IsGlobalAdmin) {
                    addLink = true;
                }
                else if(i.CampaignAdmin && i.CampaignTitle){
                    addLink = true;
                }
            });
            if(addLink){
                $('#navbarSupportedContent>.nav').append('<li><a href="https://thebank.info53.com/teams/HCInt/Learn/Gamification/SiteAssets/app/Admin.aspx">Admin Page</a></li>');
            }
        });

    }]);
})();