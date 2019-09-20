(function(){
    angular.module('WelcomeApp', [
        //'ngSanitize'
    ])

    .controller('AppCtrl', [function() {
        var ctrl = this;
        ctrl.userInfo = {};
		$('#campaign-link').text(_spPageContextInfo.webTitle);
		$('#campaign-link').attr('href',_spPageContextInfo.webAbsoluteUrl + '/SiteAssets/app/Welcome.aspx');
    }]);
})();