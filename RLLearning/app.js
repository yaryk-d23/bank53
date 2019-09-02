(function(){
    angular.module('App', [
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
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
			$('.content-wrap').css('padding-bottom', footerHeight+20);
		}

    }])
    .config(function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');

      $routeProvider
        .when('/', {
            template: '<retail-roles></retail-roles>'
        })
        .when('/retail-topics/:cardId', {
            template: '<retail-topics></retail-topics>'
        })
        .when('/portal-cards/:parentLinkId', {
            template: '<portal-cards></portal-cards>'
        })
        .when('/retail-learning/:parentLinkId', {
            template: '<retail-learning></retail-learning>'
        })
        .otherwise('/');      
    });
})();