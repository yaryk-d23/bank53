angular.module('App')
    .component('adminTable', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Admin/components/admin-table/adminTable-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$sce', '$q', '$uibModal' , componentCtrl]
    });

function componentCtrl($ApiService, $sce, $q, $uibModal){
    var ctrl = this;
    ctrl.allWebs = [];
    $ApiService.getAllWebs().then(function(res){
        ctrl.allWebs = res;
        geyAccessUserForSites();
    });

    function geyAccessUserForSites() {
        var req = {};
        angular.forEach(ctrl.allWebs, function(web){
            req[web.Title] = $ApiService.getSiteGroup(web.Url, "$filter=Title eq '"+web.Title+" Members'");
        });
        $q.all(req).then(function(res){
            angular.forEach(res, function(group, key){
                angular.forEach(ctrl.allWebs, function(web){
                    if(web.Title == key){
                        web['MemberGroup'] = group;
                    }
                });
            });
        });
    }

    ctrl.removeUser = function(groupId, userId){
        var conf = confirm("Are you sure?");
        if(conf){
            $ApiService.removeUserFromGroup(groupId, userId);
            geyAccessUserForSites();
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
            geyAccessUserForSites();
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