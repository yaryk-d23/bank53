angular.module('App')
    .component('adminTable', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Admin/components/admin-table/adminTable-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$sce', '$q', '$uibModal', '$scope' , componentCtrl]
    });

function componentCtrl($ApiService, $sce, $q, $uibModal, $scope){
    var ctrl = this;
    ctrl.currentUser = {};
    ctrl.allWebs = [];
    var allWebs = [];
    ctrl.isCampaignsAdmin = false;
    var grantedAccessCampaigns = [];
    var appReqs = {
        allWebs: $ApiService.getAllWebs(),
        currentUser: $ApiService.getCurrentUser(),
        pemissionItem: $ApiService.getPermissionListItem('$filter=UserId eq '+_spPageContextInfo.userId)
    };
    $q.all(appReqs).then(function(res){
        allWebs = res.allWebs;
        ctrl.currentUser = res.currentUser;
        angular.forEach(res.pemissionItem, function(i, key){
            if(i.IsGlobalAdmin) {
                ctrl.isCampaignsAdmin = true;
            }
        });
        if(ctrl.isCampaignsAdmin){
            ctrl.allWebs = res.allWebs;
        }
        else if(!ctrl.isCampaignsAdmin){
            angular.forEach(res.pemissionItem, function(i, key){
                if(i.CampaignAdmin && i.CampaignTitle) {
                    grantedAccessCampaigns.push(i.CampaignTitle);
                }
            });
        }
        
        
        getAccessUserForSites();
    });

    function getAccessUserForSites() {
        var req = {};
        angular.forEach(allWebs, function(web){
            req[web.Title + ' Members'] = $ApiService.getSiteGroup(web.Url, "$filter=Title eq '"+web.Title+" Members'");
            req[web.Title + ' Owners'] = $ApiService.getSiteGroup(web.Url, "$filter=Title eq '"+web.Title+" Owners'");

        });
        $q.all(req).then(function(res){
            angular.forEach(allWebs, function(web){
                angular.forEach(res, function(group, key){
                    if(web.Title +' Members'  == key){
                        web['MembersGroup'] = group;
                        
                    }
                    if(web.Title +' Owners'  == key){
                        web['OwnersGroup'] = group;
                        if(ctrl.isCampaignsAdmin){
                            web['Visible'] = true;
                        }
                        else if(grantedAccessCampaigns.indexOf(web.Title) != -1){
                            web['Visible'] = true;
                        }
                    }
                });
            });
            ctrl.allWebs = allWebs;
            setTimeout(function(){
                $scope.$apply(function(){
                    ctrl.allWebs = allWebs;
                });
            },0);
        });
    }

    ctrl.removeUser = function(groupId, userId){
        var conf = confirm("Are you sure?");
        if(conf){
            $ApiService.removeUserFromGroup(groupId, userId);
            getAccessUserForSites();
        }
    };

    ctrl.open = function (item) {
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Admin/components/admin-table/modal-view.html',
            controller: modalCtrl,
            controllerAs: 'ctrl',
            appendTo: angular.element(document.querySelectorAll('.app-container')),
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (users) {
            addUserToGroup(item.Id, users);
        }, function () {
        });
    }

    function addUserToGroup(groupId, users){
        var req = [];
        angular.forEach(users, function(user) {
            var data = {
                '__metadata': {'type': 'SP.User'},
                'LoginName': user.LoginName
            };
            req.push($ApiService.addUserToGroup(groupId, data));
        });
        $q.all(req).then(function(){
            getAccessUserForSites();
        });
    }

    function modalCtrl($uibModalInstance, item ) {
        var ctrl = this;
        ctrl.item = item;
        ctrl.users = [];
        var existingUserId = [];
        angular.forEach(item.Users, function(user){
            existingUserId.push(user.Id);
        });
        ctrl.allUsers = [];

        ctrl.getUsers = function($select) {
            if(!$select.search || $select.search.length < 3) return;
            $ApiService.getUser($select.search).then(function(res){
                ctrl.allUsers = res.filter(function(a){
                    return existingUserId.indexOf(a.Id) == -1;
                });
            });
        };
        			

        ctrl.ok = function () {
            $uibModalInstance.close(ctrl.users);
        };
      
        ctrl.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }

}