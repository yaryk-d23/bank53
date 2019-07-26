(function(){
    angular.module('App', [
        'ngRoute',
        'ui.bootstrap',
        'ngSanitize',
        'validation',
        'validation.rule',
        'Preloader',
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

    .controller('AppCtrl', [function() {
        var ctrl = this;
        
        var urlItemId = getParameterByName('ItemId');

        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return parseInt(decodeURIComponent(results[2].replace(/\+/g, " ")), 10);
        }
    }])
    .config(function($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('');

      $routeProvider
          .when('/request/new', {
              template: '<request-form></request-form>'
          })
          .when('/request/:id', {
              template: '<request-form-readonly></request-form-readonly>'
          })
         .otherwise('/request/new');      
    });
})();