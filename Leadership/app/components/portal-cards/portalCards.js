(function(){
    angular.module('App')
    .component('portalCards', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Leadership/app/components/portal-cards/portalCards-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', '$routeParams', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope, $routeParams){
        var ctrl = this;
        ctrl.parrentLinkId = $routeParams.parentLinkId;
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

        if(ctrl.parrentLinkId){
            $ApiService.getListItems('Links', "$orderBy=SortOrder&$filter=Status eq 'Active'").then(function(res){
                ctrl.allLinks = res;
                debugger;
                document.write('<link href="'+ _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/app/Leadership/app/components/portal-cards/portalCards-links-style.css?rnd" + Math.random() +'" rel="stylesheet">')
            }).catch(function(e){
                $('body .app-container').before('<link href="'+ _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/app/Leadership/app/components/portal-cards/portalCards-links-style.css?rnd" + Math.random() +'" rel="stylesheet">')
            });
        }

        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
              (rv[x[prop]] = rv[x[prop]] || []).push(x);
              return rv;
            }, {});
        }
    }
})();