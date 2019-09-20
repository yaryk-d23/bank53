(function(){
    angular.module('BadgesApp', [
        'PopUpMsg'
        //'ngSanitize'
    ])

    .controller('AppCtrl', [function() {
        $('#campaign-link').text(_spPageContextInfo.webTitle);
		$('#campaign-link').attr('href',_spPageContextInfo.webAbsoluteUrl + '/SiteAssets/app/Welcome.aspx');
    }]);
})();