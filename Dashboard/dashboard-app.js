(function(){
    angular.module('DashboardApp', [
    ])

    .controller('AppCtrl', [function() {
        setInterval(function(){
            setHeight();
        },500);
        function setHeight(){
            var height = angular.element(document.querySelectorAll('#dashboard > div > .col-sm-9'))[0].offsetHeight;
            angular.element(document.querySelectorAll('#dashboard > div > .col-sm-3 .user-info'))[0].style.height = height + 'px';
        }
    }])
    // .config(function($routeProvider, CONSTANT) {
    //     $routeProvider
    //         .when("/", {
    //             templateUrl: CONSTANT.template_base_path + '/dashboard.html?' + Math.random(),
    //             controller: "dashboardController"
    //         })        
    // });
})();