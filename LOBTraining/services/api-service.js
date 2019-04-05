(function(){
    angular.module('App')
    .factory('$ApiService', function ($http, $q) {
        return {
            getUser: getUser,
            getUserProfile: getUserProfile,
            getCurrentUser: getCurrentUser,
            getListItems: getListItems,
            getListChoiceField: getListChoiceField,
            saveData: saveData
        };

        function getUserProfile(){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties')
                .then(function(res){
                    return res.data;
                });
        }   
        function getCurrentUser(){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/currentuser')
                .then(function(res){
                    return res.data;
                });
        }  

        function getListItems(listTitle, params){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\''+listTitle+'\')/items?' + params)
                .then(function(res){
                    return res.data.value;
                });
        }

        function saveData(listTitle, data){
            return $http({
                        url: _spPageContextInfo.webAbsoluteUrl + 
                            '/_api/web/lists/getbytitle(\''+listTitle+'\')/Items',
                        method: 'POST',
                        headers: {
                            "accept": "application/json;odata=verbose",
                            "content-type": "application/json;odata=verbose",
                            "X-RequestDigest": $('#__REQUESTDIGEST').val()
                        },
                        data: data
                    }).then(function(res){
                        return res;
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

        function getUser(query){
            var url = _spPageContextInfo.webAbsoluteUrl +
                "/_api/web/siteusers?"+
                "$select="+[
                    "Id",
                    "Title",
                    "Email"
                ].join(",")+
                "&$top=20"+
                "&$filter=("+[
                    "substringof('" + query + "',Title)",
                    "substringof('" + query + "',Email)",
                    "substringof('" + capitalizeFirstLetter(query) + "',Title)",
                    "substringof('" + capitalizeFirstLetter(query) + "',Email)"
                ].join(" or ")
                + ") and PrincipalType eq 1";
            return $http({
                method: 'GET',
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose"
                },
                url: url                    
            }).then(function (res) {
                return res.data.d.results;
            });
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

    });
})();