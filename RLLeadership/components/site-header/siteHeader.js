(function(){
    angular.module('App')
    .component('siteHeader', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/RLLeadership/components/site-header/siteHeader-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope){
        var ctrl = this;
    }
})();