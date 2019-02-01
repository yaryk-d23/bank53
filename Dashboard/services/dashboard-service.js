angular.module('DashboardApp')
    .factory('$DashboardService', function ($http, $q) {
        return {
            getUserProfile: getUserProfile,
            getUserLogItem: getUserLogItem,
            getBadgesItems: getBadgesItems,
            getTaskItems: getTaskItems,
            getTaskListItems: getTaskListItems,
            getUserLogItems: getUserLogItems
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

        function getUserLogItems(filterValue){
            var filter = filterValue ? '&$filter='+filterValue : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'UsersLog\')/items?'
                +'$select=*,User/Title,User/Id,User/EMail,User/UserName&$expand=User&$orderby=XP desc&$top=3'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getBadgesItems(filter){
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

        function getTaskListItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'Tasks\')/items?$select=*,Badge/Id,Badge/Title&$expand=Badge&'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }
    });
