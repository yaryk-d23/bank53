(function(){
    angular.module('App', [
        'ui.bootstrap',
        'ngSanitize',
        'textAngular',
        'validation',
        'validation.rule',
		'ui.select'
    ])
    .filter('propsFilter', function() {
        return function(items, props) {
          var out = [];
      
          if (angular.isArray(items)) {
            var keys = Object.keys(props);
      
            items.forEach(function(item) {
              var itemMatches = false;
      
              for (var i = 0; i < keys.length; i++) {
                var prop = keys[i];
                var text = props[prop].toLowerCase();
                if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                  itemMatches = true;
                  break;
                }
              }
      
              if (itemMatches) {
                out.push(item);
              }
            });
          } else {
            // Let the output be the input untouched
            out = items;
          }
      
          return out;
        };
      })

    .controller('AppCtrl',  ['$scope',function($scope) {
        var ctrl = this;
        var intervalId = 0;
        var urlItemId = getParameterByName('ItemId');
		ctrl.showModal=false;
		intervalId = setInterval(function(){
			urlItemId = getParameterByName('ItemId');
			if(urlItemId){
				$('.b #new-track-form').on('hidden.bs.modal', function (e) {
					window.history.pushState(null,null,'?');
					ctrl.showModal=false;
				});
				ctrl.showModal = true;
				$scope.$apply();
				//clearInterval(intervalId);
				
			}
			else {
				ctrl.showModal=false;
			}
		},500);
        /*if(urlItemId){
            intervalId = setInterval(function(){
				//alert($('#new-track-form').css('display'));
				if($('#new-track-form').css('display') == 'none'){
					showModal();
				}
				else if($('#new-track-form').css('display') == 'block') {
					clearInterval(intervalId);
				}
				
            },500);
        }
		
		function showModal(){
			$('.b #new-track-form').modal('show');
			$('.b #new-track-form').on('hidden.bs.modal', function (e) {
				window.history.pushState(null,null,'?');
			});
		}*/

        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return parseInt(decodeURIComponent(results[2].replace(/\+/g, " ")), 10);
        }
    }]);
    // .config(function($routeProvider, CONSTANT) {
    //     $routeProvider
    //         .when("/", {
    //             templateUrl: CONSTANT.template_base_path + '/dashboard.html?' + Math.random(),
    //             controller: "dashboardController"
    //         })        
    // });
})();