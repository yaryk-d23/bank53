angular.module('DashboardApp')
    .factory('$DashboardService', function ($http, $q) {
        return {
            getUserProfile: getUserProfile,
            getUserLogItem: getUserLogItem,
            getBadgesItems: getBadgesItems
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
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'Badges\')/items?'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }
    });
