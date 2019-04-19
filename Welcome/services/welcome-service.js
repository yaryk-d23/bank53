angular.module('WelcomeApp')
    .factory('$WelcomeService', function ($http, $q) {
        return {
            getUserProfile: getUserProfile,
            getUserLogItem: getUserLogItem,
            createUserLogItem: createUserLogItem,
            getBadgesItems: getBadgesItems,
            createTaskItem: createOrUpdateTaskItem,
            updateTaskItem: createOrUpdateTaskItem,
            updateUserLogItem: updateUserLogItem,
            getTaskLogItems: getTaskLogItems,
            getTaskItems: getTaskItems,
            uploadFile: uploadFile,
            getBadgeIcon: getBadgeIcon,
            getAvatarsItems: getAvatarsItems,
            getSPUser: getSPUser,
            getUserLogItemByUserId: getUserLogItemByUserId
        };

        function getSPUser(query){
            var url = _spPageContextInfo.webAbsoluteUrl +
                '/_api/web/siteusers?'+
                "$select="+[
                    "Id",
                    "Title",
                    "Email"
                ].join(",")+
                "&$top=20"+
                "&$filter=("+[
                    "substringof('" + query + "',LoginName)",
                    "substringof('" + query.toLowerCase() + "',LoginName)"
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

        function getUserLogItem(userName){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'UsersLog\')/items?'
                +'$select=*,User/Title,User/Id,User/EMail,User/UserName,AvatarItem/Id,AvatarItem/Title&$expand=User,AvatarItem&$filter=User/UserName eq \'' + userName +'\'')
                .then(function(res){
                    return res.data.value;
                });
        }

        function getUserLogItemByUserId(userId){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'UsersLog\')/items?'
                +'$select=*,User/Title,User/Id,User/EMail,User/UserName,AvatarItem/Id,AvatarItem/Title&$expand=User,AvatarItem&$filter=User/Id eq \'' + userId +'\'')
                .then(function(res){
                    return res.data.value;
                });
        }

        function getAvatarsItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'Avatars\')/items?'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function createUserLogItem(data){
            return $http({
                method: "POST",
                url: _spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'UsersLog\')/items?$select=*',
                data: data,
                headers: {
                    "Content-Type" : "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val() 
                 }
                }).then(function(res){
                    return res.data.d;
                });
        }

        function getBadgesItems(filter){
            filter = filter ? filter : '';
            return new Promise(function(resolve, reject){
                $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesList\')/items?'+filter)
                    .then(function(res){
                        var request = {};
                        angular.forEach(res.data.value, function(item, k){
                            request[item.Id] = $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'Tasks\')/items?'+
                                '$select=*,Badge/Id,Badge/Title&$expand=Badge'+
                                '&$filter=Badge/Id eq '+item.Id);
                        });
                        $q.all(request).then(function(tasksRes){
                            angular.forEach(res.data.value, function(item, k){
                                item['Tasks'] = tasksRes[item.Id].data.value;
                            });
                            resolve(res.data.value);
                        });
                        //return res.data.value;
                    });
            });
        }

        function getTaskLogItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesTaskLog\')/items?'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getTaskItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'Tasks\')/items?$select=*,Badge/Id,Badge/Title&$expand=Badge&'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getBadgeIcon(badgeId){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesList\')/items('+badgeId+')')
                .then(function(res){
                    return res.data.Icon;
                });
        }

        
        function createOrUpdateTaskItem(item){
            return new Promise(function(resolve, reject){
                // var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
                var clientContext = new SP.ClientContext.get_current();

                var oList = clientContext.get_web().get_lists().getByTitle("BadgesTaskLog");
                    
                var itemCreateInfo = new SP.ListItemCreationInformation();
                if(item.Id)
                    var oListItem = oList.getItemById(item.Id);
                else
                    var oListItem = oList.addItem(itemCreateInfo);

                for(var key in item){
                    if(key!='Id' && key!='Badge' && key!='AssignedTo'){
                        oListItem.set_item(key,item[key]);
                    }
                    else if(key=='Badge'){
                        var lookupVal = new SP.FieldLookupValue();
                        lookupVal.set_lookupId(item[key]);
                        oListItem.set_item(key,lookupVal);
                    }
                    else if(key=='AssignedTo'){
                        var lookupVal = new SP.FieldLookupValue();
                        lookupVal.set_lookupId(item[key]);
                        oListItem.set_item(key,lookupVal);
                    }
                }
                oListItem.update();

                clientContext.load(oListItem);
                function thisSuccess(){
                    resolve(oListItem);
                }
                function thisFailed(request, error){
                    console.log(error);
                }
                clientContext.executeQueryAsync(thisSuccess, thisFailed);
            });
        }

        function updateUserLogItem(item){
            return new Promise(function(resolve, reject){
                var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
                var oList = clientContext.get_web().get_lists().getByTitle("UsersLog");
                var oListItem = oList.getItemById(item.Id);
                oListItem.set_item('XP',item.XP);
                oListItem.update();

                clientContext.load(oListItem);
                function thisSuccess(){
                    resolve(oListItem);
                }
                function thisFailed(request, error){
                    console.log(error);
                }
                clientContext.executeQueryAsync(thisSuccess, thisFailed);
            });
        }

        function uploadFile(data) {
            var config = {
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "X-RequestDigest": $('#__REQUESTDIGEST').val(),  
                    "Content-Type": undefined
                },
                responseType: "arraybuffer"
            };
            var url = _spPageContextInfo.webAbsoluteUrl + 
                "/_api/web/getfolderbyserverrelativeurl('"+_spPageContextInfo.webServerRelativeUrl+"/TasksLogFiles')/Files/add(overwrite=true, url='"+data.fileName+"')";
            return $http({
                    method: "POST",
                    url: url, 
                    processData: false,
                    data: data.arrayBuffer, 
                    headers: config.headers
                }).then(function(res){
                    return res.data.d;
                });
                
        }

    });
