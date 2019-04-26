(function(){
    angular.module('App')
    .config(['$provide', '$validationProvider',function($provide, $validationProvider) {
        $validationProvider.showSuccessMessage = false;
        $validationProvider
            .setExpression({
                null: function (value, scope, element, attrs) {
                    return true;
                },
                UserOrNull: function (value, scope, element, attrs) {
                    return !value || typeof value.Id === typeof 1;
                },
                requiredUser: function (value, scope, element, attrs) {
                    return value && typeof value.Id === typeof 1;
                }
            })
            .setDefaultMsg({
                null: {
                    error: '',
                    success: ''
                },
                UserOrNull: {
                    error: 'Please select or remove user',
                    success: ''
                },
                requiredUser: {
                    error: 'Please select user',
                    success: ''
                }
            });
    }])
    .component('requestForm', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/LOBTraining/components/request-form/request-form-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$SendEmail', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $SendEmail){
        var ctrl = this;
        var listTitle = 'LOBTrainingRequest';
        var urlItemId = getParameterByName('ItemId');
        ctrl.stage = 1;
        ctrl.item = {
            RequestDate: new Date(),
            RequestType: [],
            EnableAutoEnrollmentWaitlist: true,
            // TrainingRoomReserved: {}
        };
        ctrl.lobTrainingText = {};

        ctrl.requestTypeChoice = [];
        ctrl.blendedCourseTypeChoice = [];
        ctrl.topicsChoice = [];
        ctrl.instructorsChoice = [];
        ctrl.affiliateChoice = [];
        ctrl.trainingRoomsChoice = [];
        ctrl.getUser = $ApiService.getUser;
        ctrl.selectetTab = 0;
        ctrl.NumberOfOfferingsToScheduleArr = [];
        var NumberOfOfferingsToScheduleItem = {
            Instructor: null,
            ClassStartEndDateTime: null,
            MinimumEnrollmentCapacity: null,
            MaximumEnrollmentCapacity: 0,
            EnableAutoEnrollmentWaitlist: 0,
            EnableAutoEnrollmentWaitlist: false,
            Affiliate: null,
            WebinarURL: '',
            TrainingRoomReserved: null,
            TrainingRoomName: null,
            Floor: null,
            Address: null,
            City: null,
            State: null,
            Zip: null,

        };
        // ctrl.getUsers = function($select) {
        //     if(!$select.search || $select.search.length < 3) return;
        //     $ApiService.getUser($select.search).then(function(res){
        //         ctrl.allUsers = res;
        //     });
        // };

        var request = {
            blendedCourseTypeField: $ApiService.getListChoiceField(listTitle, 'BlendedCourseType'),
            requestTypeField: $ApiService.getListChoiceField(listTitle, 'RequestType'),
            affiliateField: $ApiService.getListChoiceField(listTitle, 'Affiliate'),
            topicsChoice: $ApiService.getListItems("Topics"),
            instructorsChoice: $ApiService.getListItems("Instructors"),
            trainingRoomsChoice: $ApiService.getListItems("TrainingRooms"),
            currentUser: $ApiService.getCurrentUser(),
            lobTrainingText: $ApiService.getListItems("LOBTrainingText"),
        };

        $q.all(request).then(function(res){
            ctrl.item.RoleForCourseUser = res.currentUser;
            ctrl.requestTypeChoice = res.requestTypeField.Choices.results;
            ctrl.blendedCourseTypeChoice = res.blendedCourseTypeField.Choices.results;
            ctrl.affiliateChoice = res.affiliateField.Choices.results;
            ctrl.topicsChoice = res.topicsChoice;
            ctrl.instructorsChoice = res.instructorsChoice;
            ctrl.trainingRoomsChoice = res.trainingRoomsChoice;
            ctrl.trainingRoomsChoice.push({Title: 'Other'});
            ctrl.lobTrainingText = res.lobTrainingText[0];
            // ctrl.initiativeChoice = res.initiativeField.Choices.results;
        });

        // $scope.$watch('requestForm', function(newVal, oldVal){
        //     console.log($scope);
        // }, true);
        $scope.$watch('ctrl.item.Employee', function(newVal, oldVal){
            if(ctrl.item.Employee && ctrl.item.Employee.Id){
                ctrl.item.EmployeeEmail = ctrl.item.Employee.Email;
                ctrl.item.EmployeeLineOfBusiness = ctrl.item.Employee.EmployeeLineOfBusiness || '-';
            }
        }, true);
        $scope.$watch('ctrl.NumberOfOfferingsToScheduleArr', function(newVal, oldVal){
            angular.forEach(ctrl.NumberOfOfferingsToScheduleArr, function(val){
                if(val.TrainingRoomReserved && val.TrainingRoomReserved.Title != 'Other'){
                    val.TrainingRoomName = val.TrainingRoomReserved.Title;
                    val.Floor = val.TrainingRoomReserved.Floor;
                    val.Address = val.TrainingRoomReserved.Address;
                    val.City = val.TrainingRoomReserved.City;
                    val.State = val.TrainingRoomReserved.State;
                    val.Zip = val.TrainingRoomReserved.Zip;
                }
                if(val.TrainingRoomReserved && val.TrainingRoomReserved.Title == 'Other'){
                    val.TrainingRoomName = "";
                    val.Floor = "";
                    val.Address = "";
                    val.City = "";
                    val.State = "";
                    val.Zip = "";
                }
            });
        }, true);

        ctrl.onBlurNumberOfOfferingsToSchedule = function(){
            ctrl.NumberOfOfferingsToScheduleArr = [];
            for(var i=0;i<ctrl.item.NumberOfOfferingsToSchedule;i++){
                ctrl.NumberOfOfferingsToScheduleArr.push(angular.copy(NumberOfOfferingsToScheduleItem));
            }
        };

        ctrl.saveData = function(form){
            if (form.$invalid) {
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function(errorField){
                        errorField.$setTouched();
                    });
                });
                return;
            }
            var item = angular.copy(ctrl.item);
            if(item.RequestDate){
                item.RequestDate = item.RequestDate.toISOString();
            }
            if(item.EffectiveDate){
                item.EffectiveDate = item.EffectiveDate.toISOString();
            }
            // if(item.ClassStartDate){
            //     item.ClassStartDate = item.ClassStartDate.toISOString();
            // }
            // if(item.EffectiveDate){
            //     item.ClassEndDate = item.ClassEndDate.toISOString();
            // }
            angular.forEach(item, function(value, key){
                if(!value){
                    delete item[key];
                }
            });
            item['Title'] = item.Employee.Title;
            if(item.Employee){
                item['EmployeeId'] = item.Employee.Id;
                delete item.Employee;
            }
            if(item.RoleForCourseUser){
                item['RoleForCourseUserId'] = item.RoleForCourseUser.Id;
                delete item.RoleForCourseUser;
            }
            item['RequestType'] = {"__metadata":{"type":"Collection(Edm.String)"},"results":item.RequestType};
            
            if(item.Topic){
                item['CourseNumber'] = item.Topic.CourseNumber;
                item['TopicId'] = item.Topic.Id;
                delete item.Topic;
            }
            item['__metadata'] = { "type": 'SP.Data.LOBTrainingRequestListItem' };
            $ApiService.saveData(listTitle, item).then(function(res){
                var newItemId = res.Id;
                var offeringDetailsReq = [];
                angular.forEach(ctrl.NumberOfOfferingsToScheduleArr, function(item){
                    var data = angular.copy(item);
                    data['__metadata'] = { "type": 'SP.Data.ScheduledOfferingDetailsListItem' };
                    if(data.Instructor){
                        item['InstructorId'] = data.Instructor.Id;
                        delete data.Instructor;
                    }
                    if(data.TrainingRoomReserved){
                        data['TrainingRoomReservedId'] = data.TrainingRoomReserved.Id;
                        delete data.TrainingRoomReserved;
                    }
                    angular.forEach(data, function(value, key){
                        if(!value){
                            delete data[key];
                        }
                    });
                    offeringDetailsReq.push($ApiService.saveData('ScheduledOfferingDetails', data));                    
                });
                $q.all(offeringDetailsReq).then(function(res){
                    var updateData = {};
                    updateData['__metadata'] = { "type": 'SP.Data.LOBTrainingRequestListItem' };
                    updateData['ScheduledOfferingDetailsId'] = {
                        'results': []
                    };
                    angular.forEach(res, function(val){
                        updateData['ScheduledOfferingDetailsId'].results.push(val.Id);
                    });
                    $ApiService.updateData(listTitle, newItemId, updateData).then(function(){
                        $SendEmail.Send(
                            'NewRequest', 
                            {LinkToForm: 'https://thebank.info53.com/teams/HCInt/Learn/LobTR/SitePages/App.aspx'+
                                    '#/request/'+res.Id})
                            .then(function(){
                                alert("Completed");
                        });
                    });
                });
            });
        };

        ctrl.toggleSelection = function toggleSelection(choise) {
            var idx = ctrl.item.RequestType.indexOf(choise);
        
            // Is currently selected
            if (idx > -1) {
                ctrl.item.RequestType.splice(idx, 1);
            }
        
            // Is newly selected
            else {
                ctrl.item.RequestType.push(choise);
            }
        };


        
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return parseInt(decodeURIComponent(results[2].replace(/\+/g, " ")), 10);
        }
        
        ctrl.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1,
            showWeeks: false,

        };

        
        ctrl.open1 = function() {
            ctrl.popup1.opened = true;
        };
        ctrl.open2 = function() {
            ctrl.popup2.opened = true;
        };

        
        ctrl.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        ctrl.format = ctrl.formats[0];
        
        ctrl.popup1 = {
            opened: false
        };
        ctrl.popup2 = {
            opened: false
        };
    }
})();