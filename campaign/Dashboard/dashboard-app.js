
(function(){
    angular.module('DashboardApp', [
    ])

    .controller('AppCtrl', [function() {
        setInterval(function(){
            setHeight();
        },500);
        function setHeight(){
            // if(angular.element(document.querySelectorAll('#dashboard > div > .col-lg-9'))[0] && angular.element(document).width() >= 1200) {
            //     var height = angular.element(document.querySelectorAll('#dashboard > div > .col-lg-9'))[0].offsetHeight;
            //     angular.element(document.querySelectorAll('#dashboard > div > .col-lg-3 .user-info'))[0].style.height = height + 'px';
            // }
            // else if(angular.element(document.querySelectorAll('#dashboard > div > .col-lg-3 .user-info'))[0] && angular.element(document).width() < 1200){
            //     angular.element(document.querySelectorAll('#dashboard > div > .col-lg-3 .user-info'))[0].style.height = 'auto';
            // }
            var right = $('#dashboard > div > .col-lg-9 > div');
            var left = $('#dashboard > div > .col-lg-3 .user-info');
            if(right.length && $(document).width() >= 1200){
                if($('#dashboard > div > .col-lg-3').height() > right.height() && right.height() > 375){
                    right.css('min-height', $('#dashboard > div > .col-lg-3').height() + 'px');
                }
                else {
                    left.css('min-height', right.height() + 'px');
                }
            }
            else if(left.length && $(document).width() < 1200){
                left.height('auto');
            }
            
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