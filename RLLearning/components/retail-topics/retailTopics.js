(function(){
    angular.module('App')
    .component('retailTopics', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RLLearning/components/retail-topics/retailTopics-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$routeParams', '$location', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams, $location){
        var ctrl = this;
        ctrl.retailCardId = $routeParams.cardId;
        ctrl.allRetailTopics = [];
        ctrl.emptyTopicsArr = [{},{},{},{},{},{},{},{},{},{}];
		ctrl.defaultImage = 'https://thebank.info53.com/sites/RetailLearn/SiteAssets/app/RetailLearning/assets/img/noimage.png';
        var request = {
            allRetailTopics: $ApiService.getListItems('RetailTopics', '$filter=ParentLinkId eq '+ ctrl.retailCardId),
        };

        $q.all(request).then(function(res){
            // if(res.allRetailTopics.length == 1){
            //     $location.path('/retail-learning/'+res.allRetailTopics[0].Id);
            // }
            // else {
                ctrl.allRetailTopics = res.allRetailTopics;
            // }
        });

        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
              (rv[x[prop]] = rv[x[prop]] || []).push(x);
              return rv;
            }, {});
        }
    }
})();