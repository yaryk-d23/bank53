(function(){
    angular.module('App')
    .component('banner', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/DevOps/components/banner/banner.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', bannerCtrl]
    });

    function bannerCtrl($ApiService, $q){
        var ctrl = this;
		$ApiService.getListItems('Banner', '').then(function(res){
			ctrl.banner = res[0];
		});
    }
})();