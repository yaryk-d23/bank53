(function(){
    angular.module('App')
    .component('dashboard', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Tasks/components/dashboard/dashboard-view.html?rnd' + Math.random(),
        bindings: {
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$sce', '$q', '$scope', componentCtrl]
    });

    function componentCtrl($ApiService, $sce, $q, $scope){
        var ctrl = this;
        ctrl.itemId = null;

        ctrl.allTasks = [];

        function getData(){
            var requests = {
                allTasks: $ApiService.getListItems('Tasks', '$select=*,Badge/Title&$expand=Badge')
            };
    
            $q.all(requests).then(function(res){
                ctrl.allTasks = res.allTasks;
            });
        }

        getData();

        ctrl.openForm = function(id){
            if(!id) return;
            // window.history.pushState(null,null,'?TaskId='+id);
            ctrl.itemId = id;
        };
        $('#task-modal').on('hidden.bs.modal', function (e) {
            getData();
        });
    }
})();