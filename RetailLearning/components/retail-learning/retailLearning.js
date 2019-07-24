(function(){
    angular.module('App')
    .component('retailLearning', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RetailLearning/components/retail-learning/retailLearning-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$routeParams', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams){
        var ctrl = this;
        ctrl.retailTopicId = $routeParams.topicId;
        ctrl.allretailLearning = [];
        var request = {
            allretailLearning: $ApiService.getListItems('RetailLearning', '$select=*,AuthorUser/Title&$expand=AuthorUser&$filter=RetailTopicId eq '+ ctrl.retailTopicId),
            
        };

        ctrl.getTopicHours = function(val){
            if(!val) return 0+' min';
            var result = '';
            if(val<60){
                result = val + ' min';
            }
            else {
                result = parseInt(val/60) + ' hour '+ (val%60) + ' min';
            }
            return result;
        }	

        $q.all(request).then(function(res){
			ctrl.allretailLearning = res.allretailLearning;
        });

        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
              (rv[x[prop]] = rv[x[prop]] || []).push(x);
              return rv;
            }, {});
        }
    }
})();