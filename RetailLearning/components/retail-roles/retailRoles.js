(function(){
    angular.module('App')
    .component('retailRoles', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RetailLearning/app/components/retail-roles/retailRoles-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope){
        var ctrl = this;
        ctrl.allRetailRoles = [];

        var request = {
            allRetailRoles: $ApiService.getListItems('RetailRoles', '$orderBy=SortOrder')
        };

        $q.all(request).then(function(res){
			console.log(res);
			setTimeout(function(){$scope.$apply(function(){
				ctrl.allRetailRoles = res.allRetailRoles;
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