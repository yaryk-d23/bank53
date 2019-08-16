(function(){
    angular.module('App')
    .component('retailLearning', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RLLearning/components/retail-learning/retailLearning-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$routeParams', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams){
        var ctrl = this;
        ctrl.items = [];
        ctrl.parentLinkId = $routeParams.parentLinkId;

        $ApiService.getListItems('Topics', '$orderBy=SortOrder&$filter=SubcardsLink eq '+ctrl.parentLinkId).then(function(res){
            ctrl.items = res;
        });
        ctrl.getSumTopicsHours = function(items){
            if(!items || items.length == 0) return 0+' min';
            var result = '';
            var sum = 0;
            angular.forEach(items, function(item){
                sum += item.Time ? item.Time : 0;
            });
            if(sum<60){
                result = sum + ' min';
            }
            else {
                result = parseInt(sum/60) + ' hour '+ (sum%60) + ' min';
            }
            return result;
        }	
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
    }
})();