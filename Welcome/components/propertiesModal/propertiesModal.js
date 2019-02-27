(function(){
    angular.module('WelcomeApp')
    .component('propertiesModal', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Welcome/components/propertiesModal/propertiesModal.html?rnd' + Math.random(),
        bindings: {
            user: '='
        },
        controllerAs: 'ctrl',
        controller: ['$WelcomeService', '$q', '$scope', formCtrl]
    });

    function formCtrl($WelcomeService, $q, $scope){
        var ctrl = this;
        ctrl.allAvatars = [];
        ctrl.userInfo = angular.copy(ctrl.user);

        $scope.$watch('ctrl.user', function(){
            ctrl.userInfo = angular.copy(ctrl.user);
        },true);

        ctrl.setAvatar = function(avatar){
            if(avatar.XP <= ctrl.userInfo.xp){
                ctrl.userInfo.avatar = avatar.Avatar;
            }
        };

        ctrl.saveData = function(){
            ctrl.user.avatar = ctrl.userInfo.avatar;

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
            var oList = clientContext.get_web().get_lists().getByTitle("UsersLog");
            var oListItem = oList.getItemById(ctrl.userInfo.userItemId);
            var urlValue = new  SP.FieldUrlValue();
            urlValue.set_url(ctrl.userInfo.avatar.Url);
            urlValue.set_description(ctrl.userInfo.avatar.Url);
            oListItem.set_item("Avatar", urlValue); 
            oListItem.update();

            clientContext.load(oListItem);
            function thisSuccess(){
                $('#propeties-form').modal('hide');
            }
            function thisFailed(request, error){
                console.log(error);
            }
            clientContext.executeQueryAsync(thisSuccess, thisFailed);
        };

        $WelcomeService.getAvatarsItems().then(function(res){
            ctrl.allAvatars = res;
        });
        // var requests = {
        //     allAvatars: $WelcomeService.getAvatarsItems(),
        //     userProfile: $WelcomeService.getUserProfile(),
        // };
    
        // $q.all(requests).then(async function(data){
        //     ctrl.allAvatars = data.allAvatars;
            
        //     angular.forEach(data.userProfile.UserProfileProperties, function(prop, key){
        //         if(prop.Key == "PictureURL"){
        //             ctrl.userInfo.pictureUrl = prop.Value;
        //         }
        //         if(prop.Key == "UserName"){
        //             ctrl.userInfo.userName = prop.Value;
        //         }
        //         if(prop.Key == "Department"){
        //             ctrl.userInfo.department = prop.Value || '';
        //         }
        //         if(prop.Key == "Title"){
        //             ctrl.userInfo.position = prop.Value || '';
        //         }
        //     });
        //     ctrl.userInfo.fullName = data.userProfile.DisplayName;
        //     $WelcomeService.getUserLogItem(ctrl.userInfo.userName).then(function(res){
        //         if(res.length) {
        //             var user = res[0];
        //             ctrl.userInfo.credits = user.Credits || 0;
        //             ctrl.userInfo.xp = user.XP || 0;
        //             ctrl.userInfo.userItemId = user.Id;
        //             ctrl.userInfo.avatar = user.Avatar;
        //         }
                
        //     });
        // });
    }
})();