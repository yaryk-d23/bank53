(function(){
    angular.module('App')
    .component('navBar', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/DevOps/components/nav-bar/navBar.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', tilesCtrl]
    });

    function tilesCtrl($ApiService, $q){
        var ctrl = this;
        ctrl.navigation = [];
		$ApiService.getListItems('Navigation', '$select=*, Parent/Title, Parent/Id&$expand=Parent').then(function(res){
			ctrl.navigation = res;
        });
        
        ctrl.getChildrenLink = function(parent){
            var children = [];
            angular.forEach(ctrl.navigation, function(link, key){
                if(link.ParentId == parent.Id){
                    children.push(link);
                }
            });
            return children;
        };

        ctrl.isActiveLink = function(link){
			if(!link.Link) return;
            return location.href.indexOf(link.Link.Url) != -1;
        };
    }
})();