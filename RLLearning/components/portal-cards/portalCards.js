(function(){
    angular.module('App')
    .component('portalCards', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RLLearning/app/components/portal-cards/portalCards-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$routeParams', '$uibModal', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams, $uibModal){
		$('#link-style').remove();
        var ctrl = this;
        ctrl.parentLinkId = $routeParams.parentLinkId;
        ctrl.allLinks = [];

        if(ctrl.parentLinkId){
            $ApiService.getListItems('Subcards Links', "$orderBy=SortOrder&$select=*,ParentLink/Title&$expand=ParentLink&$filter=Status eq 'Active' and ParentLinkId eq "+ctrl.parentLinkId).then(function(res){
                ctrl.allLinks = res;
            });
        }
		

        
        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
              (rv[x[prop]] = rv[x[prop]] || []).push(x);
              return rv;
            }, {});
        }
    }
})();