angular.module('App')
    .factory('$ApiService', function ($http, $q) {
        return {
            getListItems: getListItems,
            saveData: saveData,
            getListChoiceField: getListChoiceField,
            updateData: updateData
        };

        function getListItems(listTitle, params){
            return $http.get(_spPageContextInfo.webServerRelativeUrl + '/_api/web/lists/getbytitle(\''+listTitle+'\')/items?' + params)
                .then(function(res){
                    return res.data.value;
                });
        }
        function saveData(listTitle, data){
            return $http({
                        url: _spPageContextInfo.webAbsoluteUrl + 
                            '/_api/web/lists/getbytitle(\''+listTitle+'\')/Items?$select=*',
                        method: 'POST',
                        headers: {
                            "accept": "application/json;odata=verbose",
                            "content-type": "application/json;odata=verbose",
                            "X-RequestDigest": $('#__REQUESTDIGEST').val()
                        },
                        data: data
                    }).then(function(res){
                        return res.data.d;
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

        function updateData(listTitle, itemId, data){
            return $http({
                        url: _spPageContextInfo.webAbsoluteUrl + 
                            '/_api/web/lists/getbytitle(\''+listTitle+'\')/Items('+itemId+')',
                        method: 'POST',
                        headers: {
                            "accept": "application/json;odata=verbose",
                            "content-type": "application/json;odata=verbose",
                            "X-RequestDigest": $('#__REQUESTDIGEST').val(),
                            "IF-MATCH": "*",  
                            "X-HTTP-Method": "MERGE"
                        },
                        data: data
                    }).then(function(res){
                        return res;
                    });
        }
    });
