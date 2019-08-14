(function(){
    angular.module('App')
    .component('retailRoles', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RLLeadership/components/retail-roles/retailRoles-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope){
        var ctrl = this;
        ctrl.allRetailRoles = [];
        ctrl.allRetailCards = [];

        var request = {
            allRetailRoles: $ApiService.getListItems('RetailRoles', '$orderBy=SortOrder'),
            allRetailCards: $ApiService.getListItems('RetailCards'),
            
        };

        $q.all(request).then(function(res){
			setTimeout(function(){$scope.$apply(function(){
                ctrl.allRetailRoles = res.allRetailRoles;
                ctrl.allRetailCards = groupBy(res.allRetailCards, 'RetailRoleId');
			});},0);
        });

        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
              (rv[x[prop]] = rv[x[prop]] || []).push(x);
              return rv;
            }, {});
        }
    }
})();