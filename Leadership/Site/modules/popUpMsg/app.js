angular.module('PopUpMsg', [])

.run(function ($compile, $rootScope) {
    var element = angular.element('<pop-up-msg ng-app="PopUpMsg"></pop-up-msg>');
    var el = $compile(element)($rootScope);
    angular.element(document.body).append(el);

})

.factory('$PopUpMsg', function () {
    var factory = {
        visible: false,
        title: '',
        body: '',
        show: function (data) {
            this.visible = true;
            this.title = data.title;
            this.body = data.body;
        },
        hide: function () {
            this.visible = false;
            this.title = '';
            this.body = '';
        }
    }

    return factory;
})

.controller('popUpMsgCtrl', function ($scope, $PopUpMsg, $sce) {
    var ctrl = this;
    
    ctrl.visible = false;
    ctrl.Title = '';
    ctrl.Body = '';
    $scope.$watch(function () { return $PopUpMsg.visible }, function (newVal, oldVal) {
        ctrl.visible = $PopUpMsg.visible;
        ctrl.Title = $PopUpMsg.title;
        ctrl.Body = $PopUpMsg.body;
        $('#pop-up-msg').modal(ctrl.visible ? 'show' : 'hide');
    }, true);
    ctrl.trustHtml = function(html) {
        return $sce.trustAsHtml(html);
    };
    ctrl.hideModal = function(){
        $PopUpMsg.hide();
    };
})

.directive('popUpMsg', function ($PopUpMsg) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: 'modules/popUpMsg/popUpMsg.html'
        // template:
        //   '<div class="b" ng-controller="preloaderCtrl" ng-cloak>' +
        //     '<div class="pr-bg"></div>' +
        //     '<div class="pr-img"></div>' +
        //   '</div>'
    };
});


