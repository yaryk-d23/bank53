(function(){
    angular.module('App', [
        'ngRoute',
        'ui.bootstrap',
        'ngSanitize',
    ])
    .controller('AppCtrl', [function() {
        var ctrl = this;

    }])
    .config(function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');

      $routeProvider
          .when('/', {
              template: '<portal-cards></portal-cards>'
          })
          .when('/:parentLinkId', {
            template: '<portal-cards></portal-cards>'
        })
         .otherwise('/');      
    });
})();