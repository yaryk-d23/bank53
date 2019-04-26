(function(){
    angular.module('App')
    .config(['$provide', '$validationProvider',function($provide, $validationProvider) {
        $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) {
            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'p', 'pre', 'quote',
                'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['html', 'insertImage','insertLink']
            ];
            return taOptions;
        }]);
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
    .component('trackForm', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/DevOps/components/form/form.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope){
        var ctrl = this;
        var listTitle = 'TSProjects';
        var urlItemId = getParameterByName('ItemId');
        ctrl.urlItemId = urlItemId;
        ctrl.item = {
            ExpirationDate: new Date(),
            BusinessValue: 0,
            RegulatoryComplianceRelated: 0,
            CustomerEmployeeValue: 0,
            TimeSensitivity: 0,
			EstimatedProgress: 0
        };

		$(document).on('hidden.bs.modal', '#new-track-form', function (e) {
			ctrl.item = {
				ExpirationDate: new Date(),
				BusinessValue: 0,
				RegulatoryComplianceRelated: 0,
				CustomerEmployeeValue: 0,
				TimeSensitivity: 0,
				EstimatedProgress: 0
			};
			$scope.$apply();
		});   

		function clearForm(){
			ctrl.item = {
				ExpirationDate: new Date(),
				BusinessValue: 0,
				RegulatoryComplianceRelated: 0,
				CustomerEmployeeValue: 0,
				TimeSensitivity: 0,
				EstimatedProgress: 0
			};
		}
		
		ctrl.clearForm = clearForm;
 		

        if(urlItemId){
            $ApiService.getListItems(listTitle, '$select=*,LDLeader/Title,LDLeader/Id,LDLeader/EMail'+
                '&$expand=LDLeader&$filter=Id eq '+urlItemId)
                .then(function(res){
                if(res.length){
                    var item = res[0];
                    ctrl.item.ExpirationDate = new Date(item.ExpirationDate);
                    ctrl.item.Title = item.Title;
                    ctrl.item.LineOfBusiness = item.LineOfBusiness;
                    ctrl.item.Initiative = item.Initiative;
                    ctrl.item.VendorContractor = item.VendorContractor;
                    ctrl.item.Team = item.Team;
                    ctrl.item.Budget = item.Budget;
                    ctrl.item.InForecast = item.InForecast;
                    ctrl.item.EstimatedDate = item.EstimatedDate;
                    ctrl.item.EstimatedProgress = item.EstimatedProgress;
                    ctrl.item.BusinessValue = item.BusinessValue;
                    ctrl.item.RegulatoryComplianceRelated = item.RegulatoryComplianceRelated;
                    ctrl.item.CustomerEmployeeValue = item.CustomerEmployeeValue;
                    ctrl.item.TimeSensitivity = item.TimeSensitivity;
                    ctrl.item.Prioritization = item.Prioritization;
                    ctrl.item.Description = item.Description;
					ctrl.item.Status = item.Status;
                    ctrl.item.Notes = item.Notes;

                    ctrl.item.LDLeader = [];
                    angular.forEach(item.LDLeader, function(val){
                        ctrl.item.LDLeader.push({
                            DisplayText: val.Title,
                            EntityData: {
                                Email: val.EMail
                            }
                        });
                    });
					$('.b #new-track-form').modal('show');
                }
            });
        }
		ctrl.statusChoice = [];
        ctrl.teamChoice = [];
        ctrl.initiativeChoice = [];
        ctrl.allUsers = [];
        // ctrl.getUser = $ApiService.getUser;
        ctrl.getUsers = function($select) {
            if(!$select.search || $select.search.length < 3) return;
            $ApiService.getUser($select.search).then(function(res){
                ctrl.allUsers = res;
            });
        };

        ctrl.getPrioritization = function(){
            return (ctrl.item.BusinessValue * 0.35) + (ctrl.item.RegulatoryComplianceRelated * 0.3) + (ctrl.item.CustomerEmployeeValue * 0.2) + (ctrl.item.TimeSensitivity * 0.15);
        };

        var request = {
			statusField: $ApiService.getListChoiceField(listTitle, 'Status'),
            teamField: $ApiService.getListChoiceField(listTitle, 'Team'),
            initiativeField: $ApiService.getListChoiceField(listTitle, 'Initiative'),
        };

        $q.all(request).then(function(res){
			ctrl.statusChoice = res.statusField.Choices.results;
            ctrl.teamChoice = res.teamField.Choices.results;
            ctrl.initiativeChoice = res.initiativeField.Choices.results;
        });

        ctrl.saveData = function(){
            var item = angular.copy(ctrl.item);
            var usersReq = [];
            angular.forEach(item['LDLeader'], function(val){
                // var email = val.EntityData ? val.EntityData.Email : val.EMail;
                usersReq.push($ApiService.getUserByEmail(val.EntityData.Email));
            });
            if(item.ExpirationDate){
                item.ExpirationDate = item.ExpirationDate.toISOString();
            }
            item['LDLeaderId'] = {
                'results': []
            };
            $q.all(usersReq).then(function(res){
                angular.forEach(res, function(val){
                    item['LDLeaderId'].results.push(val[0].Id);
                });
                delete item['LDLeader'];

                if(urlItemId){
                    $ApiService.updateData(listTitle, urlItemId, item).then(function(){
                        $('#new-track-form').modal('hide');
                    });
                }
                else {
                    $ApiService.saveData(listTitle, item).then(function(){
                        $('#new-track-form').modal('hide');
                    });
                }
            });
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
        
        
        $scope.inlineOptions = {
            minDate: new Date(),
            showWeeks: true
        };
    
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1,
            showWeeks: false
        };

    
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

    
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    
        $scope.popup1 = {
            opened: false
        };
        
        


    }
})();