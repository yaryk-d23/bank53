angular.module('App')
    .factory('$ApiService', function ($http, $q) {
        return {
            getUserProfile: getUserProfile,
            getSiteGroup: getSiteGroup,
            removeUserFromGroup: removeUserFromGroup,
            getUser: getUser,
            getAllWebs: getAllWebs,
            addUserToGroup: addUserToGroup
        };
		
		function getAllWebs(){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + "/_api/Web/webs")
                .then(function(res){
                    return res.data.value;
                });
        }

        function getSiteGroup(siteUrl, params) {
            var group = {};
            return new Promise(function(resolve, reject){
                var url = siteUrl ? siteUrl : _spPageContextInfo.webAbsoluteUrl;
                $http.get(url + "/_api/Web/sitegroups?"+params)
                    .then(function(res){
                        group = res.data.value[0];
                        getUsersForGroup(url+'/_api/Web/sitegroups('+group.Id+')/users').then(function(users){
                            group['Users'] = users;
                            resolve(group);
                        });
                    });
            });
            
        }

        function getUsersForGroup(requestUrl){
            return $http.get(requestUrl)
                .then(function(res){
                    return res.data.value;
                });
        }

        function removeUserFromGroup(groupId, userId) {
            return $http({
                url: _spPageContextInfo.webAbsoluteUrl + '/_api/Web/SiteGroups('+groupId+')/users/removebyid('+userId+')',
                method: 'POST',
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                }
            }).then(function(res){
                return res.data.value;
            });
        }

        function addUserToGroup(groupId, data){
            return $http({
                url: _spPageContextInfo.webAbsoluteUrl + '/_api/Web/SiteGroups('+groupId+')/users',
                method: 'POST',
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                },
                data: data
            }).then(function(res){
                return res.data.value;
            });
        }

        function getUser(query){
                var url = _spPageContextInfo.webAbsoluteUrl +
                    "/_api/web/siteusers?"+
                    "$select="+[
                        "Id",
                        "Title",
                        "Email",
                        "LoginName"
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

        function getUserProfile(){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties')
                .then(function(res){
                    return res.data;
                });
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    });
