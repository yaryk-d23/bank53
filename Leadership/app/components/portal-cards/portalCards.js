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
            $ApiService.getListItems('Subcards Links', "$orderBy=SortOrder&$filter=Status eq 'Active' and ParentLinkId eq "+ctrl.parentLinkId).then(function(res){
                ctrl.allLinks = res;
                $('body .app-container').before('<link id="link-style" href="'+ _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/app/Leadership/app/components/portal-cards/portalCards-links-style.css?rnd" + Math.random() +'" rel="stylesheet">')
            }).catch(function(e){
                $('body .app-container').before('<link id="link-style" href="'+ _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/app/Leadership/app/components/portal-cards/portalCards-links-style.css?rnd" + Math.random() +'" rel="stylesheet">')
            });
        }

        ctrl.open = function (itemId, parentSelector) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Leadership/app/components/modal/modal-view.html',
                controller: modalCtrl,
                controllerAs: 'ctrl',
                appendTo: angular.element(document.querySelectorAll('.app-container')),
                resolve: {
                    itemId: function () {
                        return itemId;
                    }
				}
			});
		}

        function modalCtrl($uibModalInstance, itemId ) {
            var ctrl = this;
          
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