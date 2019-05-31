(function(){
    angular.module('App', [
        'ngRoute',
        'ngSanitize',
    ])
    .controller('AppCtrl', [function() {
        var ctrl = this;
		$(document).ready(function(){
			setInterval(function(){
				setContentWrapPadding();
			},300);
		});
		
		function setContentWrapPadding(){
			var footerHeight = $('.footer').height();
			$('.content-wrap').css('padding-bottom', footerHeight);
		}

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