(function(){
    angular.module('App', [
        'ngSanitize',
		'ui.select'
    ])

    .controller('AppCtrl', [function() {
        var ctrl = this;
        ctrl.userInfo = {};
    }]);
})();