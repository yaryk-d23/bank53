(function(){
    angular.module('App')
    .component('retailTopics', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RetailLearning/components/retail-topics/retailTopics-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$routeParams', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams){
        var ctrl = this;
        ctrl.retailCardId = $routeParams.cardId;
        ctrl.allRetailTopics = [];
		ctrl.defaultImage = 'https://thebank.info53.com/sites/RetailLearn/SiteAssets/app/RetailLearning/assets/img/noimage.png';
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