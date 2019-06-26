angular.module('LeaderboardApp')
    .factory('$LeaderboardService', function ($http, $q) {
        return {
            getUserLogItems: getUserLogItems,
            getTaskLogItems: getTaskLogItems,
            getUserProfile: getUserProfile,
            getAllWebs: getAllWebs
        };
		function getAllWebs(){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + "/_api/Web/webs")
                .then(function(res){
                    return res.data;
                });
        }

        function getUserLogItems(filterValue){
            var filter = filterValue ? '&$filter='+filterValue : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'UsersLog\')/items?'
                +'$select=*,User/Title,User/Id,User/EMail,User/UserName&$expand=User&$orderby=XP desc'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getTaskLogItems(filter){
            filter = filter ? filter : '';
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/web/lists/getbytitle(\'BadgesTaskLog\')/items?'+filter)
                .then(function(res){
                    return res.data.value;
                });
        }

        function getUserProfile(){
            return $http.get(_spPageContextInfo.webAbsoluteUrl + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties')
                .then(function(res){
                    return res.data;
                });
        }
        

    });
