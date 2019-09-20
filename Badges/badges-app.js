(function(){
    angular.module('BadgesApp', [
        'PopUpMsg'
        //'ngSanitize'
    ])

    .controller('AppCtrl', ['$BadgesService', function($BadgesService) {
        $BadgesService.getPermissionListItem('$filter=UserId eq '+_spPageContextInfo.userId).then(function(res){
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
                $('#navbarSupportedContent>.nav').append('<li><a href="Admin.aspx">Admin Page</a></li>');
            }
        });

    }]);
})();