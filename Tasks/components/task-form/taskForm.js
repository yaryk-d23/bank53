(function(){
    angular.module('App')
    .component('taskForm', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Tasks/components/task-form/taskForm-view.html?rnd' + Math.random(),
        bindings: {
            itemId: '='
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$sce', '$q', '$scope', componentCtrl]
    });

    function componentCtrl($ApiService, $sce, $q, $scope){
        var ctrl = this;
        ctrl.Item = {};

        ctrl.badgesChoice = [];
        ctrl.badgeTypeChoice = [];

        $('#task-modal').on('hidden.bs.modal', function (e) {
            ctrl.itemId = null;
            $scope.$apply();
        });

        var requests = {
            badgesChoice: $ApiService.getListItems('BadgesList'),
            badgeTypeChoice: $ApiService.getListChoiceField('Tasks', 'BadgeType'),
        };

        $q.all(requests).then(function(res){
            ctrl.badgesChoice = res.badgesChoice;
            ctrl.badgeTypeChoice = res.badgeTypeChoice.Choices.results;
        });

        function getData(){
            if(ctrl.itemId && ctrl.itemId != 'new') {
                $ApiService.getListItems('Tasks', '$select=*,Badge/Title,Badge/Id&$expand=Badge&$filter=Id eq '+ctrl.itemId).then(function(res){
                    ctrl.Item = res[0];
                    ctrl.Item.LinkedSource = ctrl.ItemLinkedSource ? ctrl.ItemLinkedSource.Url : '';
                });
            }
        }
        

        $scope.$watch('ctrl.itemId', function(){
            if(ctrl.itemId || ctrl.itemId == 'new'){
                $('body #task-modal').modal('show');
                getData();
            }
        }, true);

        ctrl.saveData = function(){
            var data = {
                Title: ctrl.Item.Title,
                XP: ctrl.Item.XP,
                BadgeType: ctrl.Item.BadgeType,
                Description: ctrl.Item.Description,
            };
            if(ctrl.Item.Badge && ctrl.Item.Badge.Id){
                data['BadgeId'] = ctrl.Item.Badge.Id;
            }
            if(ctrl.Item.LinkedSource){
                data['LinkedSource'] = {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': ctrl.Item.LinkedSource,
                    'Url': ctrl.Item.LinkedSource
                };
            }
            data['__metadata'] = { "type": 'SP.Data.TasksListItem' };

            if(ctrl.itemId && ctrl.itemId != 'new'){
				data['UniqueId0'] = 'TSK-'+(ctrl.itemId * ctrl.itemId * 53);
                $ApiService.updateData('Tasks', ctrl.itemId, data).then(function(){
                    $('#task-modal').modal('hide');
                });
            }
            else {
                $ApiService.saveData('Tasks', data).then(function(res){
                    var newData = {};
                    newData['UniqueId0'] = 'TSK-'+(res.Id * res.Id * 53);
                    newData['__metadata'] = { "type": 'SP.Data.TasksListItem' };
                    $ApiService.updateData('Tasks', res.Id, newData).then(function(){
                        $('#task-modal').modal('hide');
                    });
                });
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
    }
})();