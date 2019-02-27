(function(){
    angular.module('WelcomeApp', [
        //'ngSanitize'
    ])

    .controller('AppCtrl', [function() {
        var ctrl = this;
        ctrl.userInfo = {};
    }]);
})();