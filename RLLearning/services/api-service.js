(function(){
    angular.module('App')
    .factory('$ApiService', function ($http, $q) {
        return {
            getListItems: getListItems,
            getListChoiceField: getListChoiceField,
        };

        function getListItems(listTitle, params){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\''+listTitle+'\')/items?' + params)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getListChoiceField(listTitle, fieldName){
            return $http({
                        url: _spPageContextInfo.webAbsoluteUrl + 
                            '/_api/web/lists/getbytitle(\''+listTitle+'\')/fields?'+
                            '$filter=EntityPropertyName eq \''+fieldName+'\'',
                        method: 'GET',
                        headers: {
                            "accept": "application/json;odata=verbose",
                            "content-type": "application/json;odata=verbose"
                        }
                    }).then(function(res){
                        return res.data.d.results[0];
                    });
        }

    });
})();