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
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/Custom/app/tsProjectTracker/jump/components/form/form.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', formCtrl]
    });

    function formCtrl($ApiService, $q){
        var ctrl = this;
        var listTitle = 'TSProjectTracker';
        ctrl.item = {};
        ctrl.initiativeChoice = [];
        ctrl.priorityChoice = [];
        ctrl.allUsers = [];
        // ctrl.getUser = $ApiService.getUser;
        $ApiService.getUser().then(function(res){
            ctrl.allUsers = res;
        });



        var request = {
            initiativeField: $ApiService.getListChoiceField(listTitle, 'Initiative'),
            priorityField: $ApiService.getListChoiceField(listTitle, 'Priority'),
        };

        $q.all(request).then(function(res){
            ctrl.initiativeChoice = res.initiativeField.Choices.results;
            ctrl.priorityChoice = res.priorityField.Choices.results;
        });

        ctrl.saveData = function(){
            var item = angular.copy(ctrl.item);
            // item['zagtId'] = item['zagt'].Id;
            item['zagtId'] = {
                'results': []
            };
            item['PrincipalId'] = {
                'results': []
            };
            angular.forEach(item['zagt'], function(val, key){
                item['zagtId'].results.push(val.Id);
            });
            angular.forEach(item['Principal'], function(val, key){
                item['PrincipalId'].results.push(val.Id);
            });
            // item['PrincipalId'] = item['Principal'].Id;
            delete item['zagt'];
            delete item['Principal'];
            $ApiService.saveData(listTitle, item).then(function(){
                $('#new-track-form').modal('hide');
            });
        };


    }
})();