(function(){
    angular.module('App')
    .component('portalCards', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Leadership/app/components/portal-cards/portalCards-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$routeParams', '$uibModal', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams, $uibModal){
		$('#link-style').remove();
        var ctrl = this;
        ctrl.parentLinkId = $routeParams.parentLinkId;
        ctrl.allCategories = [];
        ctrl.groupedMainLinks = [];
        ctrl.allLinks = [];

        var request = {
            allCategory: $ApiService.getListItems('LinksCategories', '$orderBy=SortOrder'),
            allMainLinks: $ApiService.getListItems('MainLinks', "$orderBy=SortOrder&$filter=Status eq 'Active'")
        };

        $q.all(request).then(function(res){
            ctrl.allCategories = res.allCategory;
            ctrl.groupedMainLinks = groupBy(res.allMainLinks, 'CategoryId');
        });

        if(ctrl.parentLinkId){
            $ApiService.getListItems('Subcards Links', "$orderBy=SortOrder&$select=*,ParentLink/Title&$expand=ParentLink&$filter=Status eq 'Active' and ParentLinkId eq "+ctrl.parentLinkId).then(function(res){
                ctrl.allLinks = res;
                $('body .app-container').before('<link id="link-style" href="'+ _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/app/Leadership/app/components/portal-cards/portalCards-links-style.css?rnd" + Math.random() +'" rel="stylesheet">')
            }).catch(function(e){
                $('body .app-container').before('<link id="link-style" href="'+ _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/app/Leadership/app/components/portal-cards/portalCards-links-style.css?rnd" + Math.random() +'" rel="stylesheet">')
            });
        }
		

        ctrl.open = function (item, parentSelector) {
            var modalInstance = $uibModal.open({
                animation: true,
                size: 'lg',
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Leadership/app/components/modal/modal-view.html',
                controller: modalCtrl,
                controllerAs: 'ctrl',
                appendTo: angular.element(document.querySelectorAll('.app-container')),
                resolve: {
                    item: function () {
                        return item;
                    }
				}
			});
		}

        function modalCtrl($uibModalInstance, item ) {
            var ctrl = this;
            ctrl.item = item;
            ctrl.items = [];

            $ApiService.getListItems('Topics', '$orderBy=SortOrder&$filter=SubcardsLink eq '+item.Id).then(function(res){
                ctrl.items = res;
            });
			ctrl.getSumTopicsHours = function(items){
				if(!items || items.length == 0) return 0+' min';
				var result = '';
				var sum = 0;
				angular.forEach(items, function(item){
					sum += item.Time ? item.Time : 0;
				});
				if(sum<60){
					result = sum + ' min';
				}
				else {
					result = parseInt(sum/60) + ' hour '+ (sum%60) + ' min';
				}
				return result;
			}	
			ctrl.getTopicHours = function(val){
				if(!val) return 0+' min';
				var result = '';
				if(val<60){
					result = val + ' min';
				}
				else {
					result = parseInt(val/60) + ' hour '+ (val%60) + ' min';
				}
				return result;
			}				

            ctrl.ok = function () {
            //   $uibModalInstance.close(ctrl.selected.item);
            };
          
            ctrl.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
          }

        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
              (rv[x[prop]] = rv[x[prop]] || []).push(x);
              return rv;
            }, {});
        }
    }
})();