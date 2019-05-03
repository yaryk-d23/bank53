(function(){
    angular.module('App')
    .factory('$ApiService', function ($http, $q) {
        return {
            getUser: getUser,
            getUserProfile: getUserProfile,
            getCurrentUser: getCurrentUser,
            getListItems: getListItems,
            getListChoiceField: getListChoiceField,
            saveData: saveData,
            updateData: updateData,
            uploadAttachments: uploadAttachments
        };

        function uploadAttachments(listTitle, itemId, file){
            return $http({
                url: _spPageContextInfo.webAbsoluteUrl + 
                    '/_api/web/lists/getbytitle(\''+listTitle+'\')/Items('+itemId+')/AttachmentFiles/add(FileName=\''+file.name+'\')?$select=*',
                method: 'POST',
                data: file,
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": file.type,
                    "X-RequestDigest": $('#__REQUESTDIGEST').val()
                },
                data: file
            }).then(function(res){
                return res.data.d;
            });
        }

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
                            '/_api/web/lists/getbytitle(\''+listTitle+'\')/Items?$select=Id',
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

        function updateData(listTitle, itemId, data){
            return $http({
                        url: _spPageContextInfo.webAbsoluteUrl + 
                            '/_api/web/lists/getbytitle(\''+listTitle+'\')/Items('+itemId+')?$select=Id',
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

    })
    .factory('$SendEmail', function ($ApiService, $http, $q, $compile, $timeout, $rootScope) {
        return {
            Send: function (emailCode, scope) {
                return $q(function(resolve, reject) {
                    $ApiService.getListItems('EmailTemplates',"$select="+[
                            "*",
                            "To/EMail"
                        ].join(",")+
                        "&$top=1"+
                        "&$expand=To"+
                        "&$filter=Title eq '"+emailCode+"'")
                    .then(function(data){
                        var template=data[0];
                        to = []
                        angular.forEach(template.To, function(value, key) {
                            to.push(value.EMail);
                        });
                        if(to.length){
                            var $scope = $rootScope.$new();
                            angular.merge($scope, scope)
                            var elBody = $compile('<div style="display:none">' + template.Body + '</div>')($scope);
                            angular.element(document).append(elBody);
    
                            var elSubject = $compile('<div style="display:none">' + template.Subject + '</div>')($scope);
                            angular.element(document).append(elSubject);
    
                            $timeout(function() {
                                var Body = elBody.html();
                                var Subject = elSubject.html();
    
                                elBody.remove();
                                elSubject.remove();
    
                                var mail = {
                                        properties: {
                                            __metadata: { 'type': 'SP.Utilities.EmailProperties' },
                                            To: { 'results':  to },
                                            Body: Body,
                                            Subject: Subject
                                        }
                                    };
                                var siteurl = _spPageContextInfo.webAbsoluteUrl;
                                var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
                    
                                $http({
                                    method: 'POST',  
                                    url: urlTemplate,
                                    data:mail,  
                                    headers: { "Accept": "application/json;odata=verbose","content-type": "application/json;odata=verbose","X-RequestDigest": document.getElementById("__REQUESTDIGEST").value}  
                                }).then(function(data){
                                    resolve($scope.item);
                                }, function (data) {
                                    console.error('$SendEmail '+data);
                                    reject(data);
                                });
                            }, 300);
                        }else{
                            resolve()
                        }
                    }, reject);   
                });
            }
        }
    });
})();