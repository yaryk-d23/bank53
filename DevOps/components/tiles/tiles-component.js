(function(){
    angular.module('App')
    .component('tiles', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/DevOps/components/tiles/tiles.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', tilesCtrl]
    });

    function tilesCtrl($ApiService, $q){
		try{
        var ctrl = this;
        /*ctrl.tiles = [
            {
                Title: 'Title1',
                Description: 'Descriptio1',
                Image: {Url: 'https://static.gamespot.com/uploads/original/1179/11799911/2831652-windows.jpg',},
                Link: {Url: '#'}
            },{
                Title: 'New Track',
                Description: 'Descriptio2',
                Image: {Url: 'https://static.gamespot.com/uploads/original/1179/11799911/2831652-windows.jpg',},
                Link: {Url: '#'}
            },{
                Title: 'Title3',
                Description: 'Descriptio3',
                Image: {Url: 'https://static.gamespot.com/uploads/original/1179/11799911/2831652-windows.jpg',},
                Link: {Url: '#'}
            },{
                Title: 'Title4',
                Description: 'Descriptio4',
                Image: {Url: 'https://static.gamespot.com/uploads/original/1179/11799911/2831652-windows.jpg',},
                Link: {Url: '#'}
            },
        ];
        $ApiService.getListItems('TSProjectTracker').then(function(res){
            	console.log(res);
            });*/
		$ApiService.getListItems('Tiles', '$filter=IsVisible eq 1').then(function(res){
			ctrl.tiles = res;
		});
        // ctrl.openNewTrackForm = function(tile){
		// 	if(tile.Title == 'New Track'){
		// 		$('#new-track-form').modal('show');
		// 	}
        // };
		}
		catch(e){alert(e);}
    }
})();