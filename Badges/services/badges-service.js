angular.module('BadgesApp')
    .factory('$BadgesService', function ($http, $q) {
        return {
            getUserProfile: getUserProfile,
            getUserLogItem: getUserLogItem,
            getBadgesItems: getBadgesItems,
            createTaskItem: createOrUpdateTaskItem,
            updateTaskItem: createOrUpdateTaskItem,
            updateUserLogItem: updateUserLogItem,
            getTaskItems: getTaskItems
        };

        function getUserProfile(){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties')
                .then(function(res){
                    return res.data;
                });
        }

        function getUserLogItem(userName){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'UsersLog\')/items?'
                +'$select=*,User/Title,User/Id,User/EMail,User/UserName&$expand=User&$filter=User/UserName eq \'' + userName +'\'')
                .then(function(res){
                    return res.data.value;
                });
        }

        function getBadgesItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesList\')/items?'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getTaskItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesTaskLog\')/items?'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        
        function createOrUpdateTaskItem(item){
            return $http({
                method: 'POST',
                url: _spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesList\')/items',
                data: item,
                headers: {
                    "Accept": "application/json;odata=verbose",
                    'X-RequestDigest': document.getElementById("__REQUESTDIGEST").value,
                    "X-HTTP-Method": "MERGE",
                    "If-Match": "*"
                  }
              }).then(function(res){
                  return res;
              });
        }
        function createOrUpdateTaskItem(item){
            return new Promise(function(resolve, reject){
                var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
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
    });
