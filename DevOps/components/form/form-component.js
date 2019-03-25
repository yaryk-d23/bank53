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
        ctrl.item = {};
        ctrl.initiativeChoice = [];
        ctrl.priorityChoice = [];
        ctrl.allUsers = [];
        // ctrl.getUser = $ApiService.getUser;
        ctrl.getUsers = function($select) {
            if(!$select.search || $select.search.length < 3) return;
            $ApiService.getUser($select.search).then(function(res){
                ctrl.allUsers = res;
            });
        };



        // var request = {
        //     initiativeField: $ApiService.getListChoiceField(listTitle, 'Initiative'),
        //     priorityField: $ApiService.getListChoiceField(listTitle, 'Priority'),
        // };

        // $q.all(request).then(function(res){
        //     ctrl.initiativeChoice = res.initiativeField.Choices.results;
        //     ctrl.priorityChoice = res.priorityField.Choices.results;
        // });

        ctrl.saveData = function(){
            var item = angular.copy(ctrl.item);
            // item['zagtId'] = item['zagt'].Id;
            // if(item.ExpirationDate){
            //     item.ExpirationDate = item.ExpirationDate.toISOString();
            // }
            item['LDLeaderId'] = {
                'results': []
            };
            item['VendorContractorId'] = {
                'results': []
            };
            angular.forEach(item['LDLeader'], function(val, key){
                item['LDLeaderId'].results.push(val.Id);
            });
            angular.forEach(item['VendorContractor'], function(val, key){
                item['VendorContractorId'].results.push(val.Id);
            });
            // item['PrincipalId'] = item['Principal'].Id;
            delete item['LDLeader'];
            delete item['VendorContractor'];
            $ApiService.saveData(listTitle, item).then(function(){
                $('#new-track-form').modal('hide');
            });
        };
        
        
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