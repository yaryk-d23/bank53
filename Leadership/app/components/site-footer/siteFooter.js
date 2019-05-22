(function(){
    angular.module('App')
    .component('siteFooter', {
        templateUrl: _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/app/Leadership/app/components/site-footer/siteFooter-view.html?rnd' + Math.random(),
        bindings: {
            //user: '<'
        },
        controllerAs: 'ctrl',
        controller: ['$ApiService', '$q', '$scope', formCtrl]
    });

    function formCtrl($ApiService, $q, $scope){
        var ctrl = this;
        ctrl.allCategories = [];
        ctrl.groupedLinks = [];

        var request = {
            categoryField: $ApiService.getListChoiceField('FooterLinks', 'Category'),
            allLinks: $ApiService.getListItems('FooterLinks', '$orderBy=SortOrder')
        };

        $q.all(request).then(function(res){
            ctrl.allCategories = res.categoryField.Choices.results;
            ctrl.groupedLinks = groupBy(res.allLinks, 'Category');
        });

        function groupBy(xs, prop) {
            return xs.reduce(function(rv, x) {
              (rv[x[prop]] = rv[x[prop]] || []).push(x);
              return rv;
            }, {});
        }
    }
})();