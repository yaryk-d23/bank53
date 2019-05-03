(function(){
    angular.module('App')
    .component('requestFormReadonly', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/LOBTraining/components/request-form/request-form-readonly-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$routeParams', '$location', '$sce', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams, $location, $sce){
        var ctrl = this;
        var listTitle = 'LOBTrainingRequest';
        ctrl.stage = 1;
        ctrl.item = {};
        ctrl.NumberOfOfferingsToScheduleArr = [];
        ctrl.selectetTab = 0;
        ctrl.requestTypeChoice = [];
        ctrl.blendedCourseTypeChoice = [];
        ctrl.topicsChoice = [];
        ctrl.instructorsChoice = [];
        ctrl.affiliateChoice = [];
        ctrl.trainingRoomsChoice = [];
        ctrl.getUser = $ApiService.getUser;
        ctrl.requestId = $routeParams.id;
        ctrl.lobTrainingText = {};
        ctrl.trustHtml = $sce.trustAsHtml;

        if(ctrl.requestId){
            $ApiService.getListItems(listTitle, '$select=*,Employee/Title,Employee/Id,Employee/EMail,'+
                'Instructor/Title,Instructor/Id,'+
                'RoleForCourseUser/Title,RoleForCourseUser/Id,RoleForCourseUser/EMail,'+
                'TrainingRoomReserved/Title,TrainingRoomReserved/Id,'+
                'Topic/Title,Topic/Id,Topic/CourseNumber'+
                '&$expand=Instructor,TrainingRoomReserved,Employee,Topic,RoleForCourseUser&$filter=Id eq '+ctrl.requestId).then(function(res){
                if(res.length){
                    ctrl.item = res[0];
                    ctrl.item.RequestDate = moment(ctrl.item.RequestDate).format('MM/DD/YYYY');
                    ctrl.item.EffectiveDate = moment(ctrl.item.EffectiveDate).format('MM/DD/YYYY');
                    ctrl.item.ClassStartDate = moment(ctrl.item.ClassStartDate).format('MM/DD/YYYY');
                    ctrl.item.ClassEndDate = moment(ctrl.item.ClassEndDate).format('MM/DD/YYYY');
                    ctrl.item.EnableAutoEnrollmentWaitlist = ctrl.item.EnableAutoEnrollmentWaitlist ? 'Yes' : 'No';
                    var requests = [];
                    angular.forEach(ctrl.item.ScheduledOfferingDetailsId,function(val){
                        requests.push($ApiService.getListItems("ScheduledOfferingDetails", '$select=*'+
                        ',Instructor/Title,Instructor/Id,'+
                        'TrainingRoomReserved/Title,TrainingRoomReserved/Id'+
                        '&$expand=Instructor,TrainingRoomReserved'+
                        '&$filter=Id eq '+val));
                    });
                    $q.all(requests).then(function(res){
						angular.forEach(res,function(val){
							val[0].EnableAutoEnrollmentWaitlist = val[0].EnableAutoEnrollmentWaitlist ? "Yes" : "No";
							ctrl.NumberOfOfferingsToScheduleArr.push(val[0]);
						});
                    });
                }
            });
        }
        $ApiService.getListItems("LOBTrainingText").then(function(res){
            ctrl.lobTrainingText = res[0];
        });


        
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return parseInt(decodeURIComponent(results[2].replace(/\+/g, " ")), 10);
        }
        
    }
})();