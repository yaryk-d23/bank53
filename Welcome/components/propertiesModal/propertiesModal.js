(function(){
    angular.module('WelcomeApp')
    .component('propertiesModal', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Welcome/components/propertiesModal/propertiesModal.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$WelcomeService', '$q', formCtrl]
    });

    function formCtrl($WelcomeService, $q){
        var ctrl = this;
    }
})();