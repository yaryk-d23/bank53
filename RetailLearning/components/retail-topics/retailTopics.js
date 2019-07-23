(function(){
    angular.module('App')
    .component('retailTopics', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RetailLearning/components/retail-topics/retailTopics-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams){
        var ctrl = this;
        ctrl.retailCardId = $routeParams.cardId;
        ctrl.allRetailTopics = [];
        var request = {
            allRetailTopics: $ApiService.getListItems('RetailTopics', '$filter=RetailCardId eq '+ ctrl.retailCardId),
            
        };

        $q.all(request).then(function(res){
			ctrl.allRetailTopics = res.allRetailTopics;
        });

        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
              (rv[x[prop]] = rv[x[prop]] || []).push(x);
              return rv;
            }, {});
        }
    }
})();