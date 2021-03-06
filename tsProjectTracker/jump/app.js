(function(){
    angular.module('App', [
        'ui.bootstrap',
        'ngSanitize',
        'textAngular',
        'validation',
        'validation.rule',
		'ui.select'
        // 'toggle-switch',
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
        


        

    }])
    // .config(function($routeProvider, CONSTANT) {
    //     $routeProvider
    //         .when("/", {
    //             templateUrl: CONSTANT.template_base_path + '/dashboard.html?' + Math.random(),
    //             controller: "dashboardController"
    //         })        
    // });
})();